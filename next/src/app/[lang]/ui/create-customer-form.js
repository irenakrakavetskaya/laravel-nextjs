'use client';

import Link from 'next/link';
import {
    UserIcon,
    PhotoIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/[lang]/ui/button';
import { createCustomer } from '@/app/lib/actions';
//Takes two arguments: (action, initialState).
// Returns two values: [state, dispatch] - the form state, and a dispatch function (similar to useReducer)
import { useFormState } from 'react-dom';
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Form() {
    const pathname = usePathname()
    const initialState = { message: null, errors: {} };
    const createCustomerWithPath = createCustomer.bind(null, pathname)
    const [state, dispatch] = useFormState(createCustomerWithPath, initialState);

    //the following code is required for image preview
    const [selectedImage, setSelectedImage] = useState()
    // This function will be triggered when the file field change
    const imageChange = e => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0])
        }
    }
    // This function will be triggered when the "Remove This Image" button is clicked
    const removeSelectedImage = () => {
        setSelectedImage()
    }

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer avatar */}
                <div className="mb-4">
                    <label
                        htmlFor="avatar"
                        className="mb-2 block text-sm font-medium">
                        Add customer photo
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                required
                                placeholder="Upload customer avatar"
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
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Thumb"
                                    />
                                    <button
                                        onClick={removeSelectedImage}
                                        className="delete">
                                        Remove This Image
                                    </button>
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
                                required
                                placeholder="Enter customer name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="amount-error"
                            />
                            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                        <div
                            id="name-error"
                            aria-live="polite"
                            aria-atomic="true">
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
                                required
                                placeholder="Enter customer email"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="email-error"
                            />
                            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <div
                            id="email-error"
                            aria-live="polite"
                            aria-atomic="true">
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
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit" aria-disabled={state}>
                    Create Customer
                </Button>
            </div>
        </form>
    );
}
