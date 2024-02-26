import Header from '@/app/(app)/Header'
//import Button from "@/components/Button";
import RevenueChart from '@/components/RevenueChart';
//import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';

export const metadata = {
    title: 'Laravel - Dashboard',
}

export default async function Dashboard() {
    return (
        <>
            <Header title="Dashboard" />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* <Suspense fallback={<CardsSkeleton />}>
                        <CardWrapper />
                    </Suspense>*/}

                </div>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                    <Suspense fallback={<RevenueChartSkeleton />}>
                        <RevenueChart />
                    </Suspense>
                    {/*<Suspense fallback={<LatestInvoicesSkeleton />}>
                        <LatestInvoices />
                    </Suspense>*/}
                </div>



        </>
    )
}

//export default Dashboard
