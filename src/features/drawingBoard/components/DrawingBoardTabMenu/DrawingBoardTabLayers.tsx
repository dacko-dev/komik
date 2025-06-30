import { MinusIcon, PlusIcon } from 'lucide-react'
import React from 'react'

export default function DrawingBoardTabLayers() {
    return (
        <div className="flex flex-col gap-2">
            <div>
                <button className="btn btn-xs">
                    New Layer <PlusIcon size={12} />
                </button>
            </div>
            <div className="flex flex-col gap-1">
                <LayerDetails />
                <LayerDetails />
                <LayerDetails />
            </div>
        </div>
    )
}

function LayerDetails({
    layerName = 'Layer 1',
    // layerContent,
    layerId = 'layer-1',
    layerIndex = 0,
}: {
    layerName?: string
    // layerContent?: React.ReactNode
    layerId?: string
    layerIndex?: number
}) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`btn btn-ghost ${
                    isOpen && 'btn-soft'
                } btn-sm w-full justify-start`}
            >
                <span className="flex items-center gap-2">
                    {isOpen ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
                    {layerName}
                </span>
            </button>

            {isOpen && (
                <div className="p-2 rounded">
                    <p>Layer ID: {layerId}</p>
                    <p>Layer Index: {layerIndex}</p>
                </div>
            )}
        </div>
    )
}
