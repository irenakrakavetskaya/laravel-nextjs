//import Pagination from '@/app/ui/invoices/pagination';
//import Search from '@/app/ui/search';
import Table from '@/components/Table';
//import { CreateInvoice } from '@/app/ui/invoices/buttons';
import Header from '@/app/(app)/Header'
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react';
//import { fetchInvoicesPages } from '@/app/lib/data';

export const metadata = {
    title: 'Invoices',
}

export default async function Page({ searchParams }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    //const totalPages = await fetchInvoicesPages(query);

    return (
        <>
            <Header title="Invoices" />
            <div className="w-full">
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    {/*<Search placeholder="Search invoices..." />
                <CreateInvoice />*/}
                </div>
                <Suspense
                    key={query + currentPage}
                    fallback={<InvoicesTableSkeleton />}>
                    <Table query={query} currentPage={currentPage} />
                </Suspense>
                {/*<div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>*/}
            </div>
        </>
    )
}
