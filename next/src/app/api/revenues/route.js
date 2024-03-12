import { NextResponse } from 'next/server'

const token = process.env.NEXT_PUBLIC_TOKEN;
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// This API route was introduced for training purposes only, as we have a separate backend,
// so API routes that call separate backend endpoints are not necessary and may even degrade performance.
export async function GET() {
    let url = apiUrl + '/api/revenues'
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    const data = await res.json();

    return NextResponse.json({ data })
}