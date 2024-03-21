import Form from '@/app/[lang]/ui/edit-customer-form'
import Breadcrumbs from '@/app/[lang]/ui/breadcrumbs'
import { fetchCustomerById } from '@/app/lib'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { NavigationEvents } from '@/app/[lang]/ui/navigation-events'

export const metadata = {
    title: "Customer's edit",
}

export default async function Page({ params }) {
    const id = params.id
    const customer = await fetchCustomerById(id)

    if (!customer) {
        notFound()
    }

    return (
        <>
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Customers', href: '/customers' },
                        {
                            label: 'Edit Customer',
                            href: `/customers/${id}/edit`,
                            active: true,
                        },
                    ]}
                />

                <Form customer={customer} />
            </main>
        </>
    );
}