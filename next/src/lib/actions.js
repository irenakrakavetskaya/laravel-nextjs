'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const token = process.env.NEXT_PUBLIC_TOKEN;

export async function deleteInvoice(id) {
    try {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        await res.json()
    } catch (e) {
        throw new Error('Failed to delete invoice')
    }

    revalidateTag('invoices')
}

const FormSchema = z.object({
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
})

export async function updateInvoice(id, page, pathname, prevState, formData) {
    //Extracting the data from formData and  Validating the types with Zod.
    const validatedFields = FormSchema.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        let errorDescription = validatedFields.error.flatten().fieldErrors

        return {
            errors: errorDescription,
            message: 'Missing Fields. Failed to update Invoice.',
        }
    }

    // Prepare data for sending to server
    let { customerId, amount, status } = validatedFields.data
    amount = Number(amount)
    const amountInCents = amount * 100

    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                amount: amountInCents,
                status: status,
                customer_id: customerId,
            }),
        })

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    errors: {
                        error: ['Invoice is not found'],
                    },
                }
            } else {
                return {
                    errors: {
                        error: ['Failed to update Invoice'],
                    },
                }
            }
        }
        //let data = await response.json()
    } catch (error) {
        return {
            errors: {
                error: ['Failed to update Invoice'],
            },
        }
    }

    const pathnameParts = pathname.split('/');
    let locale = pathnameParts[1]?.toLowerCase();

    //clear the client cache and make a new server request.
    revalidatePath(`/${locale}/invoices`)

    //redirect the user to the invoice's page.
    redirect(`/${locale}/invoices/?page=${page}`)
}

//prevState - contains the state passed from the useFormState hook, it's a required prop.
export async function createInvoice(pathname, prevState, formData) {
    //safeParse() will return an object containing either a success or error field.
    const validatedFields = FormSchema.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
        //or using the entries()
        //const rawFormData = Object.fromEntries(formData.entries())
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                amount: amountInCents,
                status: status,
                customer_id: customerId,
            }),
        })

        if (!response.ok) {
            return {
                errors: {
                    error: ['Failed to create Invoice'],
                },
            }
        }
        //let data = await response.json()
    } catch (error) {
        return {
            errors: {
                error: ['Failed to create Invoice'],
            },
        }
    }
    const pathnameParts = pathname.split('/')
    let locale = pathnameParts[1]?.toLowerCase()

    // clear cache and trigger a new request to the server.
    revalidatePath(`/${locale}/invoices`)
    redirect(`/${locale}/invoices`)
}
