// When using the Link component - <Link href="/">Close modal</Link> - to navigate away from a page
// that shouldn't render the @modal slot anymore, we use a catch-all route that returns null.

export default function CatchAll() {
    return null
}