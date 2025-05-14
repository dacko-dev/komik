import { Sortable, SortableProps } from '@/components/dnd/Sortable/Sortable'
import { MAX_PANEL_COLUMNS, MAX_PANEL_ROWS } from '@/constants'
import { MeasuringStrategy } from '@dnd-kit/core'
import {
    AnimateLayoutChanges,
    arraySwap,
    defaultAnimateLayoutChanges,
    rectSwappingStrategy,
} from '@dnd-kit/sortable'
import clsx from 'clsx'
import React from 'react'

type PanelLayoutMakerProps = {
    columns: number
    rows: number
    onColumnsChange: (columns: number) => void
    onRowsChange: (rows: number) => void
    props?: SortableProps
}

export default function PanelLayoutMaker({
    columns = 1,
    rows = 1,
    onColumnsChange,
    onRowsChange,
    ...props
}: PanelLayoutMakerProps) {
    const animateLayoutChanges: AnimateLayoutChanges = (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true })

    const selectInputClassName = 'select rounded-none border-none z-1'
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

                <Sortable
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
            </div>
        </div>
    )
}
