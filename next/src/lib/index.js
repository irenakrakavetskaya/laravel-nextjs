import process from 'next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss'

export async function fetchRevenue() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/revenues';
    const res = await fetch(url, { next: { revalidate: 3600 }});
    let result = await res.json();

    return result;
}
