import { fetchCustomers } from '@/app/lib'
import { formatDateToLocal } from '@/app/lib/utils'

export default async function CustomersTable() {
    const customers = await fetchCustomers()

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {customers?.map(customer => (
                            <div
                                key={customer.id}
                                className="mb-2 w-full rounded-md bg-white p-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {customer?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {customer?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium">
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium">
                                    Email
                                </th>

                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {customers?.map(customer => (
                                <tr
                                    key={customer.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {customer?.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {customer?.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDateToLocal(customer.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
