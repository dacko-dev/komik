import { TLayer, useLayers } from '@/features/drawingBoard/store/useLayers'
import {
    ChevronDownIcon,
    ChevronRightIcon,
    PenLineIcon,
    PlusIcon,
    Trash2Icon,
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

export default function DrawingBoardTabLayers() {
    const layers = useLayers((state) => state.layers)

    return (
        <div className="flex flex-col gap-2">
            <div>
                <button className="btn btn-secondary btn-xs">
                    New Layer <PlusIcon size={12} />
                </button>
            </div>
            <div className="flex flex-col gap-1">
                {layers.map((layer) => (
                    <LayerDetails key={layer.id} layer={layer} />
                ))}
            </div>
        </div>
    )
}

function LayerDetails({ layer }: { layer: TLayer }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const activeLayerId = useLayers((state) => state.activeLayerId)
    const setSelectedLayer = useLayers((state) => state.setActiveLayer)
    const updateLayer = useLayers((state) => state.updateLayer)
    const removeLayer = useLayers((state) => state.removeLayer)

    const isActiveLayer = activeLayerId === layer.id

    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleEditStart = useCallback(() => {
        setIsEditing(true)
    }, [])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                setIsEditing(false)
                inputRef.current?.blur()
            }
            if (e.key === 'Escape') {
                //  Reset to original name
                updateLayer(layer.id, {
                    name: layer.name,
                })
                setIsEditing(false)
                inputRef.current?.blur()
            }
        },
        [layer.id, layer.name, updateLayer]
    )

    const handleEditEnd = useCallback(() => {
        setIsEditing(false)
        // Here you could call an API or update context with layerNameState
    }, [])

    const handleLayerNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateLayer(layer.id, { name: e.target.value })
        },
        [layer.id, updateLayer]
    )

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    return (
        <div>
            <div className="flex items-center gap-0">
                <button
                    className={`btn btn-square btn-ghost rounded-e-none 
                        ${isOpen && ' rounded-b-none'}
                        ${
                            isActiveLayer && 'bg-base-200'
                        } shadow-none border-0 btn-xs`}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {isOpen ? (
                        <ChevronDownIcon size={16} />
                    ) : (
                        <ChevronRightIcon size={16} />
                    )}
                </button>

                <article
                    className={` ${isOpen && ' rounded-b-none'}
                        ${isActiveLayer && 'bg-base-200'}
                        cursor-pointer rounded-s-none
                    flex items-center gap-2 w-full justify-start hover:bg-base-200 rounded-field `}
                    onClick={() => {
                        if (isActiveLayer) {
                            setIsOpen((prev) => !prev)
                        }
                        setSelectedLayer(layer.id)
                    }}
                >
                    <div className="flex items-center gap-2">
                        <input
                            inert={!isEditing}
                            ref={inputRef}
                            value={layer.name}
                            onChange={handleLayerNameChange}
                            onBlur={handleEditEnd}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => {
                                if (isEditing) {
                                    e.stopPropagation()
                                }
                            }}
                            // readOnly={!isEditing}
                            className={`input input-xs font-semibold px-2 border-none input-ghost flex-1 min-w-0 border-0 ${
                                isEditing
                                    ? ''
                                    : 'input-ghost border-none bg-transparent cursor-pointer '
                            }`}
                            type="text"
                            placeholder="Layer name"
                            title={layer.name}
                        />
                    </div>
                    <div className="flex items-center gap-1 ms-auto">
                        <button
                            className="btn btn-square btn-ghost btn-xs "
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsEditing((prev) => !prev)
                            }}
                        >
                            {<PenLineIcon size={14} />}
                        </button>
                        <button className="btn btn-square btn-ghost btn-error btn-xs">
                            <Trash2Icon size={14} />
                        </button>
                    </div>
                </article>
            </div>

            {isOpen && (
                <div className="p-3 border-t border-base-300 bg-base-50">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-base-content/70">ID:</span>
                            <span className="font-mono text-xs">
                                {layer.id}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
