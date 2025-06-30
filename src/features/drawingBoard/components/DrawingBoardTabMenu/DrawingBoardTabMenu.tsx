import DrawingBoardTabLayers from '@/features/drawingBoard/components/DrawingBoardTabMenu/DrawingBoardTabLayers'
import { LayersIcon, StickerIcon } from 'lucide-react'
import React from 'react'

export const drawingBoardTabs = [
    {
        name: 'layers',
        label: 'Layers',
        icon: <LayersIcon className="w-4 h-4" />,
    },
    {
        name: 'stickers',
        label: 'Stickers',
        icon: <StickerIcon className="w-4 h-4" />,
    },
] as const

type TDrawingBoardSidebarTab = (typeof drawingBoardTabs)[number]

export default function DrawingBoardTabMenu({
    name = 'drawing_board_tabs',
}: {
    name?: string
}) {
    const [activeTab, setActiveTab] =
        React.useState<TDrawingBoardSidebarTab['name']>('layers')

    return (
        <div
            role="tablist"
            className="bg-base-200 rounded-none flex flex-col gap-2 h-[auto] px-2 py-2"
        >
            <div className="flex gap-1 bg-base-100 w-full border border-base-300 rounded-field p-1">
                {drawingBoardTabs.map((tab) => (
                    <TabButton
                        key={tab.name}
                        name={name}
                        label={tab.label}
                        icon={tab.icon}
                        onClick={() => setActiveTab(tab.name)}
                        isActive={activeTab === tab.name}
                    />
                ))}
            </div>
            <div className="p-2 m-0  bg-base-100 border border-base-300 rounded-field h-full">
                {activeTab === 'layers' && <DrawingBoardTabLayers />}
                {activeTab === 'stickers' && (
                    <div className="text-center text-base-content/50">
                        Stickers content goes here
                    </div>
                )}
            </div>
        </div>
    )
}

function TabButton({
    name,
    label,
    icon,
    isActive,
    ...props
}: {
    name: string
    label: string
    icon?: React.ReactNode
    isActive?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            role="tab"
            name={name}
            className={` btn btn-sm btn-ghost font-bold grow ${
                isActive ? 'bg-base-200' : ''
            }`}
            aria-label={label}
            {...props}
        >
            <span className="flex items-center gap-2">
                {icon && <span className="">{icon}</span>}
                {label}
            </span>
        </button>
    )
}
