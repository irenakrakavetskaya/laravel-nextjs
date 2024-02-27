import process from 'next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss'
import { formatCurrency } from '@/lib/utils';

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

    return { numberOfInvoices, numberOfCustomers, totalPaidInvoices, totalPendingInvoices }
}
