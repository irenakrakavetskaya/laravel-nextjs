'use client'

import { useState } from 'react'

export default function Counter() {
    const [count, setCount] = useState(0)

    return (
        <>
            <p>Counter example:</p>
            <button
                className="rounded-md border p-2"
                onClick={() => setCount(count + 1)}>
                {count}
            </button>
        </>
    )
}
