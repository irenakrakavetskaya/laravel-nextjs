import '@/app/global.css'

export const metadata = {
    title: {
        default: 'Next-Laravel App',
    },
}
const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    )
}

export default RootLayout
