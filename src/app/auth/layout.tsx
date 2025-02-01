import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen flex items-center justify-center bg-base-300">
            <Link
                href="/"
                className="absolute z-10 top-8 left-8 btn btn-circle"
            >
                <ArrowLeft />
            </Link>
            {children}
        </div>
    )
}
