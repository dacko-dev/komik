'use client'

import ComicMakerLayout from '@/features/comicMaker/ComicMakerLayout'
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
        <ComicMakerLayout>
            <DrawingBoard />
        </ComicMakerLayout>
    )
}
