import { TAddComicPanel } from '@/app/(main)/add/comic/AddComicForm'
import { Sortable, SortableProps } from '@/components/dnd/Sortable/Sortable'
import { MAX_PANEL_COLUMNS, MAX_PANEL_ROWS } from '@/constants'
import { MeasuringStrategy } from '@dnd-kit/core'
import {
    AnimateLayoutChanges,
    arraySwap,
    defaultAnimateLayoutChanges,
    rectSwappingStrategy,
} from '@dnd-kit/sortable'
import { Images } from 'lucide-react'
import React, { useState } from 'react'

type PanelLayoutMakerProps = {
    panels: TAddComicPanel[]
    columns: number
    rows: number
    onColumnsChange: (columns: number) => void
    onRowsChange: (rows: number) => void
    onButtonClick?: () => void
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
    props?: SortableProps
}

export default function PanelLayoutMaker({
    panels,
    columns,
    rows,
    onColumnsChange,
    onRowsChange,
    onButtonClick,
    onDrop,
    ...props
}: PanelLayoutMakerProps) {
    const animateLayoutChanges: AnimateLayoutChanges = (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true })

    const selectInputClassName = 'select rounded-none border-none z-1'
    const [isDragging, setIsDragging] = useState(false)

    return (
        <div className="flex flex-col gap-2">
            <div className="border border-b-2 rounded-field border-base-300">
                <div className="flex ">
                    <label
                        className={`${selectInputClassName} rounded-tl-field`}
                    >
                        <span className="label">Columns</span>
                        <select
                            value={columns}
                            onChange={(e) =>
                                onColumnsChange(parseInt(e.target.value))
                            }
                        >
                            {Array.from(
                                { length: MAX_PANEL_COLUMNS },
                                (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {i + 1}
                                    </option>
                                )
                            )}
                        </select>
                    </label>
                    <label
                        className={`${selectInputClassName} rounded-tr-field`}
                    >
                        <span className="label">Rows</span>
                        <select
                            value={rows}
                            onChange={(e) =>
                                onRowsChange(parseInt(e.target.value))
                            }
                        >
                            {Array.from({ length: MAX_PANEL_ROWS }, (_, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {panels.length > 0 ? (
                    <Sortable<TAddComicPanel>
                        {...props}
                        className={
                            'grid grid-cols-[repeat(var(--columns),1fr)] grid-rows-[repeat(var(--rows),minmax(0,1fr))]'
                        }
                        // className={clsx(
                        //     'grid',
                        //     columns > 1 && `grid-cols-${columns}`,
                        //     rows > 1 && `grid-rows-${rows}`
                        // )}
                        style={
                            {
                                '--columns': columns,
                                '--rows': rows,
                            } as React.CSSProperties
                        }
                        items={panels}
                        itemClassName="aspect-square"
                        columns={columns}
                        rows={rows}
                        animateLayoutChanges={animateLayoutChanges}
                        strategy={rectSwappingStrategy}
                        measuring={{
                            droppable: { strategy: MeasuringStrategy.Always },
                        }}
                        reorderItems={arraySwap}
                        getNewIndex={({ id, items, activeIndex, overIndex }) =>
                            arraySwap(items, activeIndex, overIndex).indexOf(id)
                        }
                    />
                ) : (
                    <div
                        className={`flex flex-col items-center gap-2 p-10 ${
                            isDragging && 'bg-base-200'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.dataTransfer.dropEffect = 'copy'
                            setIsDragging(true)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.dataTransfer.dropEffect = 'none'
                            setIsDragging(false)
                        }}
                        onDrop={onDrop}
                    >
                        {isDragging ? (
                            <p>Drop Here</p>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-primary "
                                onClick={() => {
                                    onButtonClick?.()
                                }}
                            >
                                Add Images
                                <Images size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
