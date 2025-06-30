/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'

import clsx from 'clsx'
import Remove from '@/components/ui/PanelLayoutMaker/Panel/Remove'
import Handle from '@/components/ui/PanelLayoutMaker/Panel/Handle'
import { PANEL_ROUNDED_VALUE } from '@/appConfig'
import { TPanelBorderWidth } from '@/appTypes'

export interface Props {
    dragOverlay?: boolean
    color?: string
    disabled?: boolean
    dragging?: boolean
    handle?: boolean
    handleProps?: any
    index?: number
    fadeIn?: boolean
    transform?: Transform | null
    listeners?: DraggableSyntheticListeners
    sorting?: boolean
    style?: React.CSSProperties
    transition?: string | null
    wrapperStyle?: React.CSSProperties
    displayItem: React.ReactNode
    borderWidth?: TPanelBorderWidth
    rounded?: boolean
    onRemove?(): void
    renderItem?(args: {
        dragOverlay: boolean
        dragging: boolean
        sorting: boolean
        index: number | undefined
        fadeIn: boolean
        listeners: DraggableSyntheticListeners
        ref: React.Ref<HTMLElement>
        style: React.CSSProperties | undefined
        transform: Props['transform']
        transition: Props['transition']
        displayItem: Props['displayItem']
    }): React.ReactElement
}

export const Panel = React.memo(
    React.forwardRef<HTMLLIElement, Props>(
        (
            {
                borderWidth,
                rounded,
                color,
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handle,
                handleProps,
                index,
                listeners,
                onRemove,
                renderItem,
                sorting,
                style,
                transition,
                transform,
                displayItem,
                wrapperStyle,
                ...props
            },
            ref
        ) => {
            useEffect(() => {
                if (!dragOverlay) {
                    return
                }
                if (document) {
                    document.body.style.cursor = 'grabbing'
                }

                return () => {
                    if (document) {
                        document.body.style.cursor = ''
                    }
                    document.body.style.cursor = ''
                }
            }, [dragOverlay])

            console.log('rounded', rounded)
            console.log('borderWidth', borderWidth)

            return renderItem ? (
                renderItem({
                    dragOverlay: Boolean(dragOverlay),
                    dragging: Boolean(dragging),
                    sorting: Boolean(sorting),
                    index,
                    fadeIn: Boolean(fadeIn),
                    listeners,
                    ref,
                    style,
                    transform,
                    transition,
                    displayItem,
                })
            ) : (
                <li
                    className={clsx(
                        // styles.Wrapper,
                        'flex box-border',
                        'origin-top-left',
                        'touch-manipulation',
                        'list-none',
                        dragOverlay && ['z-[999]', 'scale-[1.05]', 'shadow-sm'],
                        fadeIn && 'fade-in',
                        // fadeIn && styles.fadeIn,
                        // sorting && styles.sorting,
                        // dragOverlay && styles.dragOverlay
                        sorting && 'pop cursor-[inherit] opacity-100'
                    )}
                    style={
                        {
                            ...wrapperStyle,
                            transition: [transition, wrapperStyle?.transition]
                                .filter(Boolean)
                                .join(', '),
                            '--translate-x': transform
                                ? `${Math.round(transform.x)}px`
                                : undefined,
                            '--translate-y': transform
                                ? `${Math.round(transform.y)}px`
                                : undefined,
                            '--scale-x': transform?.scaleX
                                ? `${transform.scaleX}`
                                : undefined,
                            '--scale-y': transform?.scaleY
                                ? `${transform.scaleY}`
                                : undefined,
                            '--index': index,
                            '--color': color,
                            transform: `translate3d(
                            ${transform ? `${Math.round(transform.x)}px` : '0'},
                            ${transform ? `${Math.round(transform.y)}px` : '0'},
                            0
                            ) scaleX(${transform?.scaleX ?? 1}) scaleY(${
                                transform?.scaleY ?? 1
                            })`,
                        } as React.CSSProperties
                    }
                    ref={ref}
                >
                    <div
                        className={clsx(
                            'group relative flex flex-grow items-center overflow-hidden border-base-300',
                            'list-none origin-center transition-shadow duration-200 ease-in select-none',
                            dragging &&
                                !dragOverlay &&
                                'opacity-[var(--dnd-dragging-opacity,0.5)] z-0',
                            !handle && 'cursor-grab touch-manipulation'
                        )}
                        style={{
                            ...style,
                            borderWidth: borderWidth
                                ? `${borderWidth}px`
                                : undefined,
                            borderRadius: rounded
                                ? `${PANEL_ROUNDED_VALUE}px`
                                : undefined,
                        }}
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
                    >
                        {displayItem}
                        <div
                            style={{
                                direction: 'ltr', // Ensure handle and remove display correctly
                            }}
                            className={
                                'absolute  top-0 w-full justify-between flex items-center gap-2 pl-2'
                            }
                        >
                            {onRemove ? (
                                <Remove
                                    className={
                                        'hidden btn group-hover:flex btn-sm btn-square hover:btn-error '
                                    }
                                    onClick={onRemove}
                                />
                            ) : null}
                            {handle ? (
                                <Handle
                                    {...handleProps}
                                    {...listeners}
                                    className={`p-2 ml-auto ${
                                        disabled &&
                                        'hidden group-hover:flex shadow-2xl'
                                    }`}
                                    // cursor={disabled && 'not-allowed' }
                                />
                            ) : null}
                        </div>
                    </div>
                </li>
            )
        }
    )
)
