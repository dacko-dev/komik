/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import {
    Active,
    Announcements,
    closestCenter,
    CollisionDetection,
    DragOverlay,
    DndContext,
    DropAnimation,
    KeyboardSensor,
    KeyboardCoordinateGetter,
    Modifiers,
    MouseSensor,
    MeasuringConfiguration,
    PointerActivationConstraint,
    ScreenReaderInstructions,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
    arrayMove,
    useSortable,
    SortableContext,
    sortableKeyboardCoordinates,
    SortingStrategy,
    rectSortingStrategy,
    AnimateLayoutChanges,
    NewIndexGetter,
} from '@dnd-kit/sortable'
import { createRange } from '@/lib/utils'
import Wrapper from '@/components/dnd/Wrapper/Wrapper'
import { Item } from '@/components/dnd/Item/Item'

export interface SortableProps {
    activationConstraint?: PointerActivationConstraint
    animateLayoutChanges?: AnimateLayoutChanges
    adjustScale?: boolean
    collisionDetection?: CollisionDetection
    coordinateGetter?: KeyboardCoordinateGetter
    // Container?: any // To-do: Fix me
    dropAnimation?: DropAnimation | null
    getNewIndex?: NewIndexGetter
    handle?: boolean
    itemCount?: number
    items?: UniqueIdentifier[]
    measuring?: MeasuringConfiguration
    modifiers?: Modifiers
    renderItem?: any
    removable?: boolean
    reorderItems?: typeof arrayMove
    strategy?: SortingStrategy
    style?: React.CSSProperties
    className?: React.HTMLAttributes<HTMLElement>['className']
    itemClassName?: React.HTMLAttributes<HTMLElement>['className']
    columns?: number
    rows?: number
    useDragOverlay?: boolean
    getItemStyles?(args: {
        id: UniqueIdentifier
        index: number
        isSorting: boolean
        isDragOverlay: boolean
        overIndex: number
        isDragging: boolean
    }): React.CSSProperties
    wrapperStyle?(args: {
        active: Pick<Active, 'id'> | null
        index: number
        isDragging: boolean
        id: UniqueIdentifier
    }): React.CSSProperties
    isDisabled?(id: UniqueIdentifier): boolean
}

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
}

const screenReaderInstructions: ScreenReaderInstructions = {
    draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
}

export function Sortable({
    activationConstraint,
    animateLayoutChanges,
    adjustScale = false,
    // Container = List,
    collisionDetection = closestCenter,
    coordinateGetter = sortableKeyboardCoordinates,
    dropAnimation = dropAnimationConfig,
    getItemStyles = () => ({}),
    getNewIndex,
    handle = false,
    itemCount = 8,
    items: initialItems,
    isDisabled = () => false,
    measuring,
    modifiers,
    removable,
    renderItem,
    reorderItems = arrayMove,
    strategy = rectSortingStrategy,
    style,
    className,
    itemClassName,
    useDragOverlay = true,
    wrapperStyle = () => ({}),
}: SortableProps) {
    const [items, setItems] = useState<UniqueIdentifier[]>(
        () =>
            initialItems ??
            createRange<UniqueIdentifier>(itemCount, (index) => index)
    )
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint,
        }),
        useSensor(TouchSensor, {
            activationConstraint,
        }),
        useSensor(KeyboardSensor, {
            // Disable smooth scrolling in Cypress automated tests
            scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
            coordinateGetter,
        })
    )
    const isFirstAnnouncement = useRef(true)
    const getIndex = (id: UniqueIdentifier) => items.indexOf(id)
    const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1
    const activeIndex = activeId != null ? getIndex(activeId) : -1
    const handleRemove = removable
        ? (id: UniqueIdentifier) =>
              setItems((items) => items.filter((item) => item !== id))
        : undefined
    const announcements: Announcements = {
        onDragStart({ active: { id } }) {
            return `Picked up sortable item ${String(
                id
            )}. Sortable item ${id} is in position ${getPosition(id)} of ${
                items.length
            }`
        },
        onDragOver({ active, over }) {
            // In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
            // The first `onDragOver` event therefore doesn't need to be announced, because it is called
            // immediately after the `onDragStart` announcement and is redundant.
            if (isFirstAnnouncement.current === true) {
                isFirstAnnouncement.current = false
                return
            }

            if (over) {
                return `Sortable item ${
                    active.id
                } was moved into position ${getPosition(over.id)} of ${
                    items.length
                }`
            }

            return
        },

        onDragEnd({ active, over }) {
            if (over) {
                return `Sortable item ${
                    active.id
                } was dropped at position ${getPosition(over.id)} of ${
                    items.length
                }`
            }

            return
        },
        onDragCancel({ active: { id } }) {
            return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
                id
            )} of ${items.length}.`
        },
    }

    useEffect(() => {
        if (activeId == null) {
            isFirstAnnouncement.current = true
        }
    }, [activeId])

    return (
        <DndContext
            accessibility={{
                announcements,
                screenReaderInstructions,
            }}
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={({ active }) => {
                if (!active) {
                    return
                }

                setActiveId(active.id)
            }}
            onDragEnd={({ over }) => {
                setActiveId(null)

                if (over) {
                    const overIndex = getIndex(over.id)
                    if (activeIndex !== overIndex) {
                        setItems((items) =>
                            reorderItems(items, activeIndex, overIndex)
                        )
                    }
                }
            }}
            onDragCancel={() => setActiveId(null)}
            measuring={measuring}
            modifiers={modifiers}
        >
            <Wrapper className={className} style={style} center>
                <SortableContext items={items} strategy={strategy}>
                    {/* <Container> */}
                    {items.map((value, index) => (
                        <SortableItem
                            className={itemClassName}
                            key={value}
                            id={value}
                            handle={handle}
                            index={index}
                            style={getItemStyles}
                            wrapperStyle={wrapperStyle}
                            disabled={isDisabled(value)}
                            renderItem={renderItem}
                            onRemove={handleRemove}
                            animateLayoutChanges={animateLayoutChanges}
                            useDragOverlay={useDragOverlay}
                            getNewIndex={getNewIndex}
                        />
                    ))}
                    {/* </Container> */}
                </SortableContext>
            </Wrapper>
            {useDragOverlay
                ? createPortal(
                      <DragOverlay
                          adjustScale={adjustScale}
                          dropAnimation={dropAnimation}
                      >
                          {activeId != null ? (
                              <Item
                                  className={itemClassName}
                                  value={items[activeIndex]}
                                  handle={handle}
                                  renderItem={renderItem}
                                  wrapperStyle={wrapperStyle({
                                      active: { id: activeId },
                                      index: activeIndex,
                                      isDragging: true,
                                      id: items[activeIndex],
                                  })}
                                  style={getItemStyles({
                                      id: items[activeIndex],
                                      index: activeIndex,
                                      isSorting: activeId !== null,
                                      isDragging: true,
                                      overIndex: -1,
                                      isDragOverlay: true,
                                  })}
                                  dragOverlay
                              />
                          ) : null}
                      </DragOverlay>,
                      document.body
                  )
                : null}
        </DndContext>
    )
}

interface SortableItemProps {
    animateLayoutChanges?: AnimateLayoutChanges
    disabled?: boolean
    getNewIndex?: NewIndexGetter
    id: UniqueIdentifier
    index: number
    handle: boolean
    useDragOverlay?: boolean
    onRemove?(id: UniqueIdentifier): void
    style(values: any): React.CSSProperties
    renderItem?(args: any): React.ReactElement
    wrapperStyle: SortableProps['wrapperStyle']
    className?: React.HTMLAttributes<HTMLElement>['className']
}

export function SortableItem({
    disabled,
    animateLayoutChanges,
    getNewIndex,
    handle,
    id,
    index,
    onRemove,
    style,
    renderItem,
    useDragOverlay,
    wrapperStyle,
    className,
}: SortableItemProps) {
    const {
        active,
        attributes,
        isDragging,
        isSorting,
        listeners,
        overIndex,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        animateLayoutChanges,
        disabled,
        getNewIndex,
    })

    return (
        <Item
            className={className}
            ref={setNodeRef}
            value={id}
            disabled={disabled}
            dragging={isDragging}
            sorting={isSorting}
            handle={handle}
            handleProps={
                handle
                    ? {
                          ref: setActivatorNodeRef,
                      }
                    : undefined
            }
            renderItem={renderItem}
            index={index}
            style={style({
                index,
                id,
                isDragging,
                isSorting,
                overIndex,
            })}
            onRemove={onRemove ? () => onRemove(id) : undefined}
            transform={transform}
            transition={transition}
            wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
            listeners={listeners}
            data-index={index}
            data-id={id}
            dragOverlay={!useDragOverlay && isDragging}
            {...attributes}
        />
    )
}
