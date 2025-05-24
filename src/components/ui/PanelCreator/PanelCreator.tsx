/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import {
    type Active,
    type Announcements,
    closestCenter,
    type CollisionDetection,
    DragOverlay,
    DndContext,
    type DropAnimation,
    KeyboardSensor,
    type KeyboardCoordinateGetter,
    type Modifiers,
    MouseSensor,
    type MeasuringConfiguration,
    type PointerActivationConstraint,
    type ScreenReaderInstructions,
    TouchSensor,
    type UniqueIdentifier,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
    arrayMove,
    useSortable,
    SortableContext,
    sortableKeyboardCoordinates,
    type SortingStrategy,
    rectSortingStrategy,
    type AnimateLayoutChanges,
    type NewIndexGetter,
} from '@dnd-kit/sortable'
import Wrapper from '@/components/ui/PanelCreator/Wrapper'
import Grid from '@/components/ui/PanelCreator/Grid'
import { Panel } from '@/components/ui/PanelCreator/Panel/Panel'

// import { createRange } from "../../utilities";
// import { List } from "./List";
// import { Wrapper } from "./Wrapper";
// import { Item } from "./Item";

export interface Props<T> {
    activationConstraint?: PointerActivationConstraint
    animateLayoutChanges?: AnimateLayoutChanges
    adjustScale?: boolean
    collisionDetection?: CollisionDetection
    coordinateGetter?: KeyboardCoordinateGetter
    dropAnimation?: DropAnimation | null
    getNewIndex?: NewIndexGetter
    handle?: boolean
    items?: T[]
    onColumnsChange: (columns: number) => void
    onRowsChange: (rows: number) => void
    getItemId: (item: T) => UniqueIdentifier
    displayValue?: (item: T) => React.ReactNode
    measuring?: MeasuringConfiguration
    modifiers?: Modifiers
    renderItem?: any
    removable?: boolean
    reorderItems?: typeof arrayMove
    strategy?: SortingStrategy
    style?: React.CSSProperties
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

export function PanelCreator<T>({
    activationConstraint,
    animateLayoutChanges,
    adjustScale = false,
    collisionDetection = closestCenter,
    coordinateGetter = sortableKeyboardCoordinates,
    dropAnimation = dropAnimationConfig,
    getItemStyles = () => ({}),
    getNewIndex,
    handle = false,
    items: initialItems,
    // columns,
    // onColumnsChange,
    getItemId,
    displayValue,
    isDisabled = () => false,
    measuring,
    modifiers,
    removable,
    renderItem,
    reorderItems = arrayMove,
    strategy = rectSortingStrategy,
    style,
    useDragOverlay = true,
    wrapperStyle = () => ({}),
}: Props<T>) {
    const [items, setItems] = useState<T[]>(() => initialItems ?? [])
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
    const getIndex = (id: UniqueIdentifier) => {
        const index = items.findIndex((item) => getItemId(item) === id)
        if (index === -1) {
            throw new Error(`Item with id ${String(id)} not found`)
        }
        return index
    }
    const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1
    const activeIndex = activeId != null ? getIndex(activeId) : -1
    // const handleRemove = removable
    //   ? (id: UniqueIdentifier) =>
    //       setItems((items) => items.filter((item) => item !== id))
    //   : undefined;

    const handleRemove = removable
        ? (id: UniqueIdentifier) =>
              setItems((items) =>
                  items.filter((item) => getItemId(item) !== id)
              )
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
            <Wrapper style={style} center>
                <SortableContext
                    items={items.map(getItemId)}
                    strategy={strategy}
                >
                    <Grid>
                        {items.map((value, index) => (
                            <SortablePanel
                                key={getItemId(value)}
                                id={getItemId(value)}
                                handle={handle}
                                index={index}
                                style={getItemStyles}
                                wrapperStyle={wrapperStyle}
                                disabled={isDisabled(getItemId(value))}
                                renderItem={renderItem}
                                onRemove={handleRemove}
                                animateLayoutChanges={animateLayoutChanges}
                                useDragOverlay={useDragOverlay}
                                getNewIndex={getNewIndex}
                            />
                        ))}
                    </Grid>
                </SortableContext>
            </Wrapper>
            {useDragOverlay
                ? createPortal(
                      <DragOverlay
                          adjustScale={adjustScale}
                          dropAnimation={dropAnimation}
                      >
                          {activeId != null ? (
                              <Panel
                                  // displayValue={items[activeIndex]}
                                  displayValue={
                                      displayValue
                                          ? displayValue(items[activeIndex])
                                          : undefined
                                  }
                                  handle={handle}
                                  renderItem={renderItem}
                                  wrapperStyle={wrapperStyle({
                                      active: { id: activeId },
                                      index: activeIndex,
                                      isDragging: true,
                                      id: getItemId(items[activeIndex]),
                                  })}
                                  style={getItemStyles({
                                      id: getItemId(items[activeIndex]),
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

interface SortablePanelProps {
    animateLayoutChanges?: AnimateLayoutChanges
    disabled?: boolean
    getNewIndex?: NewIndexGetter
    id: UniqueIdentifier
    index: number
    handle: boolean
    displayValue?: React.ReactNode
    useDragOverlay?: boolean
    onRemove?(id: UniqueIdentifier): void
    style(values: any): React.CSSProperties
    renderItem?(args: any): React.ReactElement
    wrapperStyle: Props<any>['wrapperStyle']
}

export function SortablePanel({
    disabled,
    animateLayoutChanges,
    getNewIndex,
    handle,
    id,
    displayValue,
    index,
    onRemove,
    style,
    renderItem,
    useDragOverlay,
    wrapperStyle,
}: SortablePanelProps) {
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
        <Panel
            ref={setNodeRef}
            // value={id}
            displayValue={displayValue}
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
