import ThemeSwitch from '@/app/[lang]/ui/theme-switch'
//flex min-h-screen flex-col items-center
const Header = ({ title }) => {
    return (
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
    )
}

export default Header
