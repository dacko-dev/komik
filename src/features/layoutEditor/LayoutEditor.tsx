import LayoutBoard from '@/features/layoutEditor/LayoutBoard'
import React from 'react'

export default function LayoutEditor() {
    return (
        <div className="flex w-full h-full">
            <div className="w-full flex flex-col items-center justify-center">
                <LayoutBoard />
            </div>
            <div className="flex border-l border-base-300">
                <LayoutEditorSidebar />
            </div>
        </div>
    )
}

function LayoutEditorSidebar() {
    return (
        <div
            role="tablist"
            className="bg-base-200 rounded-none flex flex-col gap-2 h-[auto] px-2 py-2"
        >
            <div className="flex gap-1 bg-base-100 w-full border border-base-300 rounded-field p-1 h-full">
                sidebar
            </div>
        </div>
    )
}
