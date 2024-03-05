'use server'

import process from 'next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss'
import { formatCurrency } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const ITEMS_PER_PAGE = 6
const token = process.env.NEXT_PUBLIC_TOKEN;

export async function fetchRevenue() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/revenues'
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await res.json();
}

export async function fetchLatestInvoices() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices?limit=5';
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    let data = await res.json();
    let invoices = data['invoices'];
    const latestInvoices = invoices.map(invoice => ({
        ...invoice,
        amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices
}

export async function fetchCardData() {
    let invoicesUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices'
    let customersUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/customers'
    let paidInvoicesUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices?status=paid'
    let pendingInvoicesUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices?status=pending'
    let urls = [invoicesUrl, customersUrl, paidInvoicesUrl, pendingInvoicesUrl]

    let result = await Promise.all(
        urls.map(url =>
            fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => ({ data }))
                .catch(error => ({ error, url })),
        ),
    )

    const numberOfInvoices = result[0].data['count'];
    const numberOfCustomers = result[1].data.length
    const totalPaidInvoices = result[2].data['invoices'].length
    const totalPendingInvoices = result[3].data['invoices'].length

    return {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    }
}

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

    revalidatePath('/dashboard/invoices')
}

export async function fetchFilteredInvoices(query, currentPage, limit) {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices`
    if (limit) {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        url += `?limit=${ITEMS_PER_PAGE}&offset=${offset}`;
    }
    if (query && !limit) {
        url += `?query=${query}`;
    } else if (query && limit) {
        url += `&query=${query}`;
    }
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    let data = await res.json()
    let invoices = data['invoices'];
    let count = data['count'];
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);

    return [invoices, totalPages];
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

export async function updateInvoice(id, page, prevState, formData) {
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
        let data = await response.json()
    } catch (error) {
        return {
            errors: {
                error: ['Failed to update Invoice'],
            },
        }
    }

    //clear the client cache and make a new server request.
    revalidatePath('/dashboard/invoices')

    //redirect the user to the invoice's page.
    redirect(`/dashboard/invoices?page=${page}`)
}

export async function fetchInvoiceById(id) {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        let data = await res.json()
        data.amount = data.amount / 100

        return data
    } catch (error) {
        throw new Error('Failed to fetch invoice.')
    }
}

export async function fetchCustomers() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/customers'
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json()
    } catch (err) {
        throw new Error('Failed to fetch all customers.')
    }
}

//prevState - contains the state passed from the useFormState hook, it's a required prop.
export async function createInvoice(prevState, formData) {
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
        let data = await response.json()
    } catch (error) {
        return {
            errors: {
                error: ['Failed to create Invoice'],
            },
        }
    }

    // clear cache and trigger a new request to the server.
    revalidatePath('/dashboard/invoices');

    redirect('/dashboard/invoices');
}