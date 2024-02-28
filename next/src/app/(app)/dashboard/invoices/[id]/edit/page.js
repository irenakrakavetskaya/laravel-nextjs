import Form from '@/app/ui/edit-form';
//import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/lib';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata = {
    title: 'Invoice edit',
};

export default async function Page({ params }) {
    const id = params.id;

    // use Promise.all to fetch both the invoice and customers in parallel:
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    //invoke notFound if the invoice doesn't exist:
    if (!invoice) {
        notFound();
    }

    return (
        <main>
            {/*<Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />*/}
            <Form invoice={invoice} customers={customers} />
        </main>
    );
}