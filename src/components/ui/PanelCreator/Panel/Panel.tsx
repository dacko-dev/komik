/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'

import styles from './Item.module.css'
import clsx from 'clsx'
import Remove from '@/components/ui/PanelCreator/Panel/Remove'
import Handle from '@/components/ui/PanelCreator/Panel/Handle'

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
    displayValue: React.ReactNode
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
        displayValue: Props['displayValue']
    }): React.ReactElement
}

export const Panel = React.memo(
    React.forwardRef<HTMLLIElement, Props>(
        (
            {
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
                displayValue,
                wrapperStyle,
                ...props
            },
            ref
        ) => {
            useEffect(() => {
                if (!dragOverlay) {
                    return
                }

                document.body.style.cursor = 'grabbing'

                return () => {
                    document.body.style.cursor = ''
                }
            }, [dragOverlay])

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
                    displayValue,
                })
            ) : (
                <li
                    className={clsx(
                        // styles.Wrapper,
                        'flex',
                        'origin-top-left',
                        'touch-manipulation',
                        'transition-transform',
                        dragOverlay && [
                            'z-[999]',
                            'scale-[1.05]',
                            'shadow-[0_15px_15px_0_rgba(34,33,81,0.25),-1px_0_15px_0_rgba(34,33,81,0.01)]',
                        ],
                        fadeIn && 'fade-in',
                        // fadeIn && styles.fadeIn,
                        sorting && styles.sorting
                        // dragOverlay && styles.dragOverlay
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
                        } as React.CSSProperties
                    }
                    ref={ref}
                >
                    <div
                        className={clsx(
                            'group relative flex flex-grow items-center list-none origin-center transition-shadow duration-200 ease-[cubic-bezier(0.18,0.67,0.6,1.22)] select-none',
                            // 'px-5',
                            // 'py-[18px]',
                            'bg-base-100',
                            'shadow-md',
                            'outline-none',
                            // 'rounded-[calc(4px/var(--scale-x,1))]',
                            // 'list-none',
                            // 'origin-center',
                            '',
                            styles.Item,
                            dragging && styles.dragging,
                            handle && styles.withHandle,
                            dragOverlay && styles.dragOverlay,
                            disabled && styles.disabled,
                            color && styles.color
                        )}
                        style={style}
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
                    >
                        {displayValue}
                        <span className={styles.Actions}>
                            {onRemove ? (
                                <Remove
                                    className={'hidden group-hover:block'}
                                    onClick={onRemove}
                                />
                            ) : null}
                            {handle ? (
                                <Handle {...handleProps} {...listeners} />
                            ) : null}
                        </span>
                    </div>
                </li>
            )
        }
    )
)
