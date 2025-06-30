'use client'

import DrawingBoardCanvas from '@/features/drawingBoard/components/DrawingBoardCanvas'
import DrawingBoardTabMenu from '@/features/drawingBoard/components/DrawingBoardTabMenu/DrawingBoardTabMenu'
import DrawingBoardToolbar from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbar'

// IMPORTANT: import with next/dynamic to avoid SSR issues - Module not found: Can't resolve 'canvas'

export default function DrawingBoard() {
    return (
        <div className="flex w-full h-full">
            <div className="relative w-full drawing-board">
                <DrawingBoardToolbar />
                <DrawingBoardCanvas />
            </div>
            <div className="flex border-l border-base-300">
                <DrawingBoardTabMenu />
            </div>
        </div>
    )
}
