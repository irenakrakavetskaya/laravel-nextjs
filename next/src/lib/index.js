'use server'

import process from 'next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss'
import { formatCurrency } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {redirect} from "next/navigation";

export async function fetchRevenue() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/revenues';
    const res = await fetch(url, { next: { revalidate: 3600 }});
    let result = await res.json();

    return result;
}

export async function fetchLatestInvoices() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices?limit=5';
    const res = await fetch(url, { next: { revalidate: 3600 } })
    let data = await res.json();
    const latestInvoices = data.map(invoice => ({
        ...invoice,
        amount: formatCurrency(invoice.amount),
    }))

    return latestInvoices
}

export async function fetchCardData() {
    let invoicesUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices';
    let customersUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/customers';
    let paidInvoicesUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices?status=paid'
    let pendingInvoicesUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices?status=pending'
    let urls = [invoicesUrl, customersUrl, paidInvoicesUrl, pendingInvoicesUrl];

    let result = await Promise.all(
        urls.map(url =>
            fetch(url)
                .then(res => res.json())
                .then(data => ({ data }))
                .catch(error => ({ error, url })),
        ),
    )

    const numberOfInvoices = result[0].data.length;
    const numberOfCustomers = result[1].data.length;
    const totalPaidInvoices = result[2].data.length;
    const totalPendingInvoices = result[3].data.length;

    return {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    }
}

export async function deleteInvoice(id) {
    let url =
        process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
    const res = await fetch(url, {
        method: 'DELETE',
    });
    await res.json();

    try {
        let url =
            process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
        const res = await fetch(url, {
            method: 'DELETE',
        });
        await res.json();
    } catch (e) {
        throw new Error('Failed to delete invoice')
    }

    revalidatePath('/dashboard/invoices');
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
    query,
    currentPage
) {
    //const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices?limit=${ITEMS_PER_PAGE}`;
    const res = await fetch(url, { next: { revalidate: 3600 } })//3600
    let data = await res.json();

    return data;

    /*
        const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;*/
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id, formData) { //id, prevState, formData
    //Extracting the data from formData and  Validating the types with Zod.
    /*const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });*/

    const sentFields = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    }

    // If form validation fails, return errors early. Otherwise, continue.
    /*if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }*/

    // Prepare data for insertion into the database
    //const { customerId, amount, status } = validatedFields.data;
    const { customerId, amount, status } = sentFields;
    const amountInCents = amount * 100;

    //Passing the variables to your SQL query.
    try {
        let url =
            process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
        const res = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ amount: amountInCents, status: status, customerId: customerId }),
        });
        const data = await res.json();
    } catch (error) {
        return { message: 'Failed to Update Invoice.' };
    }

    //return Response.json(data);
    //clear the client cache and make a new server request.
    revalidatePath('/dashboard/invoices');

    //redirect the user to the invoice's page.
    redirect('/dashboard/invoices');
}

export async function fetchInvoiceById(id) {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`;
    try {
        const res = await fetch(url);
        let data = await res.json();
        data.amount = data.amount / 100;

        return data;
    } catch (error) {
        throw new Error('Failed to fetch invoice.');
    }
}

export async function fetchCustomers() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/customers';
    try {
        const res = await fetch(url, { next: { revalidate: 3600 } })
        return await res.json();
    } catch (err) {
        throw new Error('Failed to fetch all customers.');
    }
}