import { MainHeader } from '@/components/layout/MainHeader/MainHeader'
import React from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid grid-cols-(--main-grid-cols) grid-rows-(--main-grid-rows) auto-rows-auto min-h-screen">
            <MainHeader />
            <main className="col-start-2 col-end-3">{children}</main>
        </div>
    )
}
