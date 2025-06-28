'use client'
import ComicMakerNavbar from '@/features/comicMaker/ComicMakerNavbar'
import ComicMakerSidebar from '@/features/comicMaker/ComicMakerSidebar'
import dynamic from 'next/dynamic'
import React from 'react'

const DrawingBoard = dynamic(
    () => import('@/features/drawingBoard/components/DrawingBoard'),
    {
        ssr: false,
    }
)

export default function ComicMaker() {
    return (
        <div className="h-screen grid grid-cols-[auto_1fr]">
            <ComicMakerSidebar />
            <main className="flex flex-col">
                <ComicMakerNavbar />
                <DrawingBoard />
            </main>
        </div>
    )
}
