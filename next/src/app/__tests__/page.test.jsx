import { expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
//import Todo from '../src/app/[lang]/(app)/todos/page'
import Page from '../[lang]/(app)/home/page'
//import Header from '../src/app/[lang]/ui/Header'

test('Page', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
/*
test('Todo', () => {
    render(<Todo />)
    expect(screen.getByRole('heading', { level: 2, name: 'Todos' })).toBeDefined()

    const header = within(screen.getByRole("header"));
    const  div = header.getByRole("div");
    expect(
        div.getByRole("heading", { level: 2, name: 'Todos' }),
    ).toBeDefined();



    //expect(screen.getByRole('heading', { level: 1, name: 'Панель управления' })).toBeDefined()
})


/*
import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Home from "../pages/home";

test("Pages Router", () => {
    render(<Home />);
    const main = within(screen.getByRole("main"));
    expect(
        main.getByRole("heading", { level: 1, name: /welcome to next\.js!/i }),
    ).toBeDefined();

    const footer = within(screen.getByRole("contentinfo"));
    const link = within(footer.getByRole("link"));
    expect(link.getByRole("img", { name: /vercel logo/i })).toBeDefined();
});

<main className={styles.main}>
    <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
    </h1>

/*
<header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="justify-between p-2">
                    <ThemeSwitch />
                </div>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {title}
                </h2>
            </div>
        </header>
export default function Page() {
    return (
        <div>
            <h1>Home</h1>
            <Link href="/about">About</Link>
        </div>
    )
}
export default async function Dashboard({ params: { lang } }) {
    const dict = await getDictionary(lang) // en or ru

    return (
        <>
            <Header title={dict.dashboard.title} />

            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
            <div className="grid gap-6 sm:grid-cols-6 lg:grid-cols-8 counter">
                <Counter />
            </div>
        </>
    )
}
*/
