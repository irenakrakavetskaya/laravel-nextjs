import Form from '@/app/[lang]/ui/create-customer-form'
import Breadcrumbs from '@/app/[lang]/ui/breadcrumbs'

export const metadata = {
    title: 'Customer create',
};

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/customers' },
                    {
                        label: 'Create Customer',
                        href: '/customers/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}