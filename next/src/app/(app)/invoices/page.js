import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/table';
import { CreateInvoice } from '@/app/ui/buttons';
import Header from '@/app/ui/Header'
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react';
import { fetchFilteredInvoices } from '@/lib'

export const metadata = {
    title: 'Invoices',
}

export default async function Page({ searchParams }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const [, totalPages] = await fetchFilteredInvoices(query, currentPage);

    return (
        <>
            <Header title="Invoices" />
            <div className="w-full">
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Search invoices..." />
                    <CreateInvoice />
                </div>
                <Suspense
                    key={query + currentPage}
                    fallback={<InvoicesTableSkeleton />}>
                    <Table query={query} currentPage={currentPage} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </>
    )
}
