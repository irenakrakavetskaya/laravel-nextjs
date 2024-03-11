import '@/app/global.css'

export const metadata = {
    title: {
        default: 'Next-Laravel App',
        description: 'Example of App of Laravel integrated with Next',
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
