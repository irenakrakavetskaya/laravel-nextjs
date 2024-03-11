// Return a list of `params` to populate the [id] dynamic segment
import Breadcrumbs from '@/app/ui/breadcrumbs'

// The generateStaticParams function can be used in combination with dynamic route segments
// to statically generate routes at build time instead of on-demand at request time.
// http://localhost:3000/invoices/45
export async function generateStaticParams() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/invoices`
    const token = process.env.NEXT_PUBLIC_TOKEN;
    const posts = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(res => res.json())
    let invoices = posts['invoices'];

    return invoices.map(item => ({
        slug: item.slug,
    }))
}

export default function Page({ params }) {
    const { id } = params

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/invoices' },
                    {
                        label: `View Invoice ${id}`,
                        href: `/invoices/${id}`,
                        active: true,
                    },
                ]}
            />
        </main>
    )
}