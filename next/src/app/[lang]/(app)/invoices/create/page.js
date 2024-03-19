import Form from '@/app/[lang]/ui/create-form';
import Breadcrumbs from '@/app/[lang]/ui/breadcrumbs';
import { fetchCustomers } from '@/app/lib';

export const metadata = {
    title: 'Invoice create',
};

export default async function Page() {
    //fetches customers and passes it to the <Form> component
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/invoices' },
                    {
                        label: 'Create Invoice',
                        href: '/invoices/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}