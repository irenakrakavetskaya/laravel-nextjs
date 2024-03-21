'use client'

import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { deleteInvoice } from '@/app/lib/actions'
import { deleteCustomer } from '@/app/lib/actions'
import Button from '@/pages/ui/Button'

export function CreateInvoice() {
    let createLink = `/invoices/create`

    return (
        <Link
            href={createLink}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <span className="hidden md:block">Create Invoice</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    )
}

export function UpdateInvoice({ id, page }) {
    let updateLink = `/invoices/${id}/edit?page=${page}`

    return (
        <Link
            href={updateLink}
            className="rounded-md border p-2 hover:bg-gray-100">
            <PencilIcon className="w-5" />
        </Link>
    )
}

export function DeleteInvoice({ id }) {
    return (
        <Button
            className="ml-4 bg-red-600 hover:bg-red-500"
            onClick={async () => {
                await deleteInvoice(id)
            }}>
            Delete
        </Button>
    )
}

export function UpdateCustomer({ id }) {
    let updateLink = `/customers/${id}/edit`

    return (
        <Link
            href={updateLink}
            className="rounded-md border p-2 hover:bg-gray-100">
            <PencilIcon className="w-5" />
        </Link>
    )
}

export function DeleteCustomer({ id }) {
    return (
        <Button
            className="ml-4 bg-red-600 hover:bg-red-500"
            onClick={async () => {
                await deleteCustomer(id)
            }}>
            Delete
        </Button>
    )
}
