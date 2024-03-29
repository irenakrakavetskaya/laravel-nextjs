import Form from '@/app/[lang]/ui/edit-form';
import Breadcrumbs from '@/app/[lang]/ui/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib';
import { notFound } from 'next/navigation';
import { Suspense } from 'react'
import { NavigationEvents } from '@/app/[lang]/ui/navigation-events'

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
        <>
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Invoices', href: '/invoices' },
                        {
                            label: 'Edit Invoice',
                            href: `/invoices/${id}/edit`,
                            active: true,
                        },
                    ]}
                />

                <Form invoice={invoice} customers={customers} />
            </main>
            <Suspense fallback={null}>
                <NavigationEvents />
            </Suspense>
        </>
    );
}