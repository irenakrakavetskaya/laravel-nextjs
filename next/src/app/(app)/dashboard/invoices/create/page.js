import Form from '@/app/ui/create-form';
import Breadcrumbs from '@/components/Breadcrumbs';
import { fetchCustomers } from '@/lib';

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
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Create Invoice',
                        href: '/dashboard/invoices/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}