import ComicMakerLayout from '@/features/comicMaker/ComicMakerLayout'
import React from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <ComicMakerLayout>{children}</ComicMakerLayout>
}
