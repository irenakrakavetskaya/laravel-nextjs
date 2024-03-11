import Header from '@/app/ui/Header'
import RevenueChart from '@/app/ui/revenueChart';
import LatestInvoices from '@/app/ui/latestInvoices';
import CardWrapper from '@/app/ui/cards';
import { Suspense } from 'react';
import {
    RevenueChartSkeleton,
    LatestInvoicesSkeleton,
    CardsSkeleton,
} from '@/app/ui/skeletons'

export const metadata = {
    title: 'Laravel - Dashboard',
}

export default async function Dashboard() {
    return (
        <>
            <Header title="Dashboard" />
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
        </>
    )
}
