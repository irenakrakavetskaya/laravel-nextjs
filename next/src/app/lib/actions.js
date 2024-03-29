'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const token = process.env.API_TOKEN
const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
]

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

const FormCustomerSchema = z.object({
    name: z.string({
        invalid_type_error: 'Please enter a customer.',
    }),
    email: z.string().email({
        invalid_type_error: 'Please enter a valid email.',
    }),
})

const FormCustomerImageSchema = z.object({
    avatar: z.custom(val => val instanceof File, 'Please upload a file')
        .refine(
            file => ACCEPTED_IMAGE_TYPES.includes(file.type),
            { message: '.jpg, .jpeg, .png and .webp files are accepted.' }
        )
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            { message: 'Max file size is 5MB.' }
        )
})

export async function deleteInvoice(id) {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
    try {
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

    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
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

    const pathnameParts = pathname.split('/')
    let locale = pathnameParts[1]?.toLowerCase()

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
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data
    const amountInCents = amount * 100

    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/`
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

export async function createTodo(prevState, formData) {
    const schema = z.object({
        todo: z.string().min(1),
    })
    const validatedField = schema.safeParse({
        todo: formData.get('todo'),
    })

    if (!validatedField.success) {
        return { message: 'Failed to create todo' }
    }

    const { todo } = validatedField.data
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/todos/`
    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                todo: todo,
            }),
        })
        revalidateTag('todos')

        return { message: `Added todo ${data.todo}` }
    } catch (e) {
        return { message: 'Failed to create todo' }
    }
}

export async function deleteTodo(prevState, formData) {
    let id = formData.get('id')
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/todos/${id}`
    try {
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        revalidateTag('todos')

        return { message: `Deleted todo` }
    } catch (e) {
        return { message: 'Failed to delete todo' }
    }
}

export async function createCustomer(pathname, prevState, formData) {
    //safeParse() will return an object containing either a success or error field.
    const validatedFields = FormCustomerSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
    })
    const validatedImg = FormCustomerImageSchema.safeParse({
        avatar: formData.get('avatar'),
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }
    if (!validatedImg.success) {
        return {
            errors: validatedImg.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }

    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/customers/`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if (!response.ok) {
            return {
                errors: {
                    error: ['Failed to create Customer'],
                },
            }
        }
    } catch (error) {
        return {
            errors: {
                error: ['Failed to create Customer'],
            },
        }
    }
    const pathnameParts = pathname.split('/')
    let locale = pathnameParts[1]?.toLowerCase()

    // clear cache and trigger a new request to the server.
    revalidatePath(`/${locale}/customers`)
    redirect(`/${locale}/customers`)
}

export async function deleteCustomer(id) {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/customers/${id}`
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        await res.json()
    } catch (e) {
        throw new Error('Failed to delete customer')
    }

    revalidateTag('customers')
}

export async function updateCustomer(id, pathname, prevState, formData) {
    let isNewImageUploaded = formData.get('avatar').name === 'undefined'
    let validatedImg = { success: true }
    const validatedFields = FormCustomerSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
    })

    if (isNewImageUploaded) {
        formData.delete('avatar')
    } else {
        validatedImg = FormCustomerImageSchema.safeParse({
            avatar: formData.get('avatar'),
        })
    }

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }
    if (!validatedImg.success) {
        return {
            errors: validatedImg.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }

    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/customers/${id}`
    let generalErrorMsg = 'Failed to update Customer'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    errors: {
                        error: ['Customer is not found'],
                    },
                }
            } else {
                let error = await response.json()
                let errorMsg = error.message
                    ? generalErrorMsg + ' - ' + error.message
                    : generalErrorMsg

                return {
                    errors: {
                        error: [errorMsg],
                    },
                }
            }
        }
    } catch (error) {
        return {
            errors: {
                error: [generalErrorMsg],
            },
        }
    }
    const pathnameParts = pathname.split('/')
    let locale = pathnameParts[1]?.toLowerCase()

    // clear cache and trigger a new request to the server.
    revalidatePath(`/${locale}/customers`)
    redirect(`/${locale}/customers`)
}
