'use client'
import ComicMakerNavbar from '@/features/comicMaker/ComicMakerNavbar'
import ComicMakerSidebar from '@/features/comicMaker/ComicMakerSidebar'
import React from 'react'
import type { PropsWithChildren } from 'react'

export default function ComicMakerLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-screen grid grid-cols-[auto_1fr]">
            <ComicMakerSidebar />
            <main className="flex flex-col">
                <ComicMakerNavbar />
                <div className="h-full">{children}</div>
            </main>
        </div>
    )
}
