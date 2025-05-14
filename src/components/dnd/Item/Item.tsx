/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'
import { Handle } from '@/components/dnd/Item/components/Handle'
import Remove from '@/components/dnd/Item/components/Remove'
import clsx from 'clsx'

// https://github.com/clauderic/dnd-kit/blob/master/stories/components/Item/Item.tsx

export interface RenderItem {
    (args: {
        dragOverlay: boolean
        dragging: boolean
        sorting: boolean
        index: number | undefined
        fadeIn: boolean
        listeners: DraggableSyntheticListeners
        ref: React.Ref<HTMLElement>
        style: React.CSSProperties
        className: React.HTMLAttributes<HTMLElement>['className']
        transform: ItemProps['transform']
        transition: ItemProps['transition']
        value: ItemProps['value']
    }): React.ReactElement
}

export interface ItemProps {
    dragOverlay?: boolean
    color?: string
    disabled?: boolean
    dragging?: boolean
    handle?: boolean
    handleProps?: any
    height?: number
    index?: number
    fadeIn?: boolean
    transform?: Transform | null
    listeners?: DraggableSyntheticListeners
    sorting?: boolean
    transition?: string | null
    wrapperClassName?: React.HTMLAttributes<HTMLElement>['className']
    wrapperStyle?: React.CSSProperties
    className?: React.HTMLAttributes<HTMLElement>['className']
    style: React.CSSProperties
    value: React.ReactNode
    onRemove?(): void
    renderItem?: RenderItem
}

const baseItemClass =
    'relative flex  flex-grow items-center p-4 bg-base-200 text-base-content font-normal text-base whitespace-nowrap  shadow transition-shadow duration-200 ease-[cubic-bezier(0.18,0.67,0.6,1.22)]'

export const Item = React.memo(
    React.forwardRef<HTMLLIElement, ItemProps>(
        (
            {
                color,
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handle,
                handleProps,
                height,
                index,
                listeners,
                onRemove,
                renderItem,
                sorting,
                transition,
                transform,
                value,
                className,
                style,
                wrapperClassName,
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
                    className,
                    style,
                    transform,
                    transition,
                    value,
                })
            ) : (
                <li
                    className={`
                        flex origin-top-left touch-manipulation
            ${fadeIn && 'animate-fade-in'}
            ${sorting && ''}
            ${
                dragOverlay &&
                'cursor-[inherit] animate-pop scale-dnd shadow-md opacity-100'
            }
            ${wrapperClassName}
          `}
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
                    <article
                        className={clsx(
                            baseItemClass,
                            dragging &&
                                'opacity-[var(--dnd-dragging-opacity,0.5)] z-0 ',
                            handle && 'cursor-grab touch-manipulation',
                            dragOverlay &&
                                'cursor-default shadow-md scale-[var(--dnd-scale)]',
                            disabled &&
                                'bg-base-200 text-base-content/50 cursor-not-allowed',
                            color && 'pl-4 border-l-4', // Optional visual cue — use border color as needed
                            className
                        )}
                        style={style}
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
                    >
                        {value}
                        <span
                            className={
                                'absolute right-2 top-1/2 -translate-y-1/2'
                            }
                        >
                            {onRemove ? (
                                <Remove className={''} onClick={onRemove} />
                            ) : null}
                            {handle ? (
                                <Handle {...handleProps} {...listeners} />
                            ) : null}
                        </span>
                    </article>
                </li>
            )
        }
    )
)
