import AppLayout from '@/app/(app)/layout'

export default function MyApp({ Component, pageProps }) {
    return (
        <AppLayout>
            {<Component {...pageProps} />}
        </AppLayout>
    )
}
