'use client'

import { ArrowPathIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { lusitana } from '@/app/[lang]/ui/fonts'
import useSWR from 'swr'
import { formatCurrency } from '@/lib/utils'

export default function LatestInvoices() {
    // added example with useSWR
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/invoices?limit=5';
    const token = process.env.NEXT_PUBLIC_TOKEN;
    const getData = async url => {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return await response.json();
    }
    const { data, error } = useSWR(url, getData);
    if (error) return <div>Error, please try again</div>
    if (!data) return <div>Loading...</div>
    let invoices = data['invoices'];
    const latestInvoices = invoices.map(invoice => ({
        ...invoice,
        amount: formatCurrency(invoice.amount),
    }));

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Latest Invoices
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                <div className="bg-white px-6">
                    {latestInvoices.map((invoice, i) => {
                        return (
                            <div
                                key={invoice.id}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}>
                                <div className="flex items-center">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {invoice.customer?.name}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {invoice.customer?.email}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    {invoice.amount}
                                </p>
                            </div>
                        );
                    })}*
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">
                        Updated just now
                    </h3>
                </div>
            </div>
        </div>
    )
}
