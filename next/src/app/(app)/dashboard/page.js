import Header from '@/app/(app)/Header'
import RevenueChart from '@/components/RevenueChart';
import LatestInvoices from '@/components/LatestInvoices';
import CardWrapper from '@/components/Cards';
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

//export default Dashboard
