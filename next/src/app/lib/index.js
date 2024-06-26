const ITEMS_PER_PAGE = 6

// Since the environment variable API_KEY is not prefixed with NEXT_PUBLIC, it's a private variable
// that can only be accessed on the server. To prevent your environment variables from being leaked to the client
// The file should be in the app directoru
const token = process.env.API_TOKEN;

/*
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
*/

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
                next: { revalidate: 360 },
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
        next: { tags: ['invoices'], revalidate: 3600 }, // on-demand revalidation and Time-based Revalidation
    });
    let data = await res.json()
    let invoices = data['invoices'];
    let count = data['count'];
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);

    return [invoices, totalPages];
}

export async function fetchInvoiceById(id) {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices/${id}`
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
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
            next: { tags: ['customers'] },
        })
        return await res.json()
    } catch (err) {
        throw new Error('Failed to fetch all customers.')
    }
}

export async function fetchTodos() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/todos'
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['todos'] }, // on-demand revalidation
        })
        return await res.json()
    } catch (err) {
        throw new Error(err)
    }
}

export async function fetchCustomerById(id) {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/customers/${id}`
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        return await res.json()
    } catch (error) {
        throw new Error('Failed to fetch customer.')
    }
}
