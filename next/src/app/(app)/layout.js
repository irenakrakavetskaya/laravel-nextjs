'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '../../components/Navigation'
import Loading from '@/app/(app)/Loading'
import Template from '@/app/(app)/template'

const AppLayout = ({ modal, children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    // To open the modal, pass the @modal slot as a prop to the parent layout and render it alongside the children prop.
    return (
        <div className="min-h-screen bg-gray-100">
            <div>{modal}</div>
            <Navigation user={user} />
            <main>{children}</main>
            <div id="modal-root" />
            {/*
            template.js is rendered between a layout and its children.
            Main or layout can be used here but not both
            <Template key={Math.random()}>{children}</Template>
            */}
        </div>
    )
}

export default AppLayout
