'use client'

import { useAuth } from '@/hooks/auth'
//import Navigation from '@/app/(app)/Navigation'
import Navigation from '../../components/Navigation'
import Loading from '@/app/(app)/Loading'
import Template from '@/app/(app)/template'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />
            <main>{children}</main>
            {/*
            template.js is rendered between a layout and its children.
            Main or layout can be used here but not both
            <Template key={Math.random()}>{children}</Template>
            */}
        </div>
    )
}

export default AppLayout
