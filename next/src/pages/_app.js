import AppLayout from '@/app/[lang]/(app)/layout'

export default function MyApp({ Component, pageProps }) {
    return (
        <AppLayout>
            {<Component {...pageProps} />}
        </AppLayout>
    )
}
