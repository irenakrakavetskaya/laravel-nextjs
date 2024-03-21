// Return a list of `params` to populate the [id] dynamic segment
import Breadcrumbs from '@/app/[lang]/ui/breadcrumbs'
import { UserCircleIcon, UserIcon } from '@heroicons/react/24/outline'
import { fetchCustomerById } from '@/app/lib'
import Image from 'next/image'

// The generateStaticParams function can be used in combination with dynamic route segments
// to statically generate routes at build time instead of on-demand at request time.
// http://localhost:3000/invoices/45
export async function generateStaticParams() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/customers`
    const token = process.env.NEXT_PUBLIC_TOKEN;
    const customers = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(res => res.json())

    return customers.map(item => ({
        slug: item.slug,
    }))
}

export default async function Page({ params }) {
    const { id } = params
    const customer = await fetchCustomerById(id)

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/customers' },
                    {
                        label: `View Customer ${id}`,
                        href: `/customers/${id}`,
                        active: true,
                    },
                ]}
            />
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer avatar */}
                <div className="mb-4">
                    <p className="mb-2 block text-sm font-medium">
                        Customer photo
                    </p>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <p className="peer block w-full rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
                                {/*Since Next.js does not have access to remote files during the build process,
                                you'll need to provide the width, height and optional blurDataURL props manually.*/}
                                <Image
                                    src={
                                        process.env.NEXT_PUBLIC_BACKEND_URL +
                                        '/' +
                                        customer?.avatar
                                    }
                                    className="rounded-full"
                                    width={28}
                                    height={28}
                                    alt={`${customer?.name}'s profile picture`}
                                />
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer name */}
                <div className="mb-4">
                    <p className="mb-2 block text-sm font-medium">
                        Customer name
                    </p>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            <p className="peer block w-full rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
                                {customer?.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer email */}
                <div className="mb-4">
                    <p className="mb-2 block text-sm font-medium">
                        Customer email
                    </p>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            <p className="peer block w-full rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
                                {customer?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}