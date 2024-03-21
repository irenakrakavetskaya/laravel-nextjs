'use client'

import {
    PhotoIcon,
    UserCircleIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/[lang]/ui/button'
import { updateCustomer } from '@/app/lib/actions'
import { useFormState } from 'react-dom'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function EditInvoiceForm({ customer }) {
    const pathname = usePathname()

    const initialState = { message: null, errors: {} }
    const updateCustomerWithId = updateCustomer.bind(
        null,
        customer.id,
        pathname,
    )
    const [state, dispatch] = useFormState(updateCustomerWithId, initialState)

    //the following code is required for image preview
    let defaultImage =
        process.env.NEXT_PUBLIC_BACKEND_URL + '/' + customer?.avatar
    //console.log(defaultImage);
    const [selectedImage, setSelectedImage] = useState(defaultImage)
    // This function will be triggered when the file field change
    const imageChange = e => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0])
        }
    }
    let previewImg =
        selectedImage instanceof File
            ? URL.createObjectURL(selectedImage)
            : defaultImage

    return (
        <form action={dispatch}>
            <input type="hidden" name="id" value={customer.id} />
            {/* Customer avatar */}
            <div className="mb-4">
                <label
                    htmlFor="avatar"
                    className="mb-2 block text-sm font-medium">
                    Add customer photo
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative" id="file-input">
                        <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            placeholder="Update customer avatar"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="avatar-error"
                            accept="image/*"
                            onChange={imageChange}
                        />
                        <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div className="container-preview">
                        {selectedImage && (
                            <div className="preview">
                                <img src={previewImg} alt="Thumb" />
                            </div>
                        )}
                    </div>
                    <div
                        id="avatar-error"
                        aria-live="polite"
                        aria-atomic="true">
                        {state.errors?.avatar &&
                            state.errors.avatar.map(error => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
            </div>

            {/* Customer name */}
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium">
                    Add customer name
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={customer.name}
                            required
                            placeholder="Enter customer name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="amount-error"
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map(error => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
            </div>

            {/* Customer email */}
            <div className="mb-4">
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium">
                    Add customer email
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={customer.email}
                            required
                            placeholder="Enter customer email"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="email-error"
                        />
                        <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map(error => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
            </div>

            {state.errors?.error &&
                state.errors.error.map(error => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
                    Cancel
                </Link>
                <Button type="submit" aria-disabled={state}>
                    Update Customer
                </Button>
            </div>
        </form>
    )
}
