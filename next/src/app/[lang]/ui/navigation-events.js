'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationEvents() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const url = `${pathname}`
        alert(
            `You are going to edit invoice with ID ${url} from ${searchParams}`,
        )
    }, [pathname, searchParams])

    return null
}