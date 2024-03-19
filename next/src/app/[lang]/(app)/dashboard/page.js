import Header from '@/app/[lang]/ui/Header'
import RevenueChart from '@/app/[lang]/ui/revenueChart';
import LatestInvoices from '@/app/[lang]/ui/latestInvoices';
import CardWrapper from '@/app/[lang]/ui/cards';
import { Suspense } from 'react';
import {
    RevenueChartSkeleton,
    LatestInvoicesSkeleton,
    CardsSkeleton,
} from '@/app/[lang]/ui/skeletons'
import { getDictionary } from '@/app/dictionaries'
import Counter from '@/app/[lang]/ui/counter'

export const metadata = {
    title: 'Laravel - Dashboard',
}

export default async function Dashboard({ params: { lang } }) {
    const dict = await getDictionary(lang) // en or ru

    return (
        <>
            <Header title={dict.dashboard.title} />

            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
            <div className="grid gap-6 sm:grid-cols-6 lg:grid-cols-8 counter">
                <Counter />
            </div>
        </>
    )
}
