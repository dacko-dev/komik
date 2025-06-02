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
import Wrapper from '@/components/ui/PanelLayoutMaker/Wrapper'
import { Panel } from '@/components/ui/PanelLayoutMaker/Panel/Panel'
import { PlusIcon } from 'lucide-react'
import { PANEL_ROUNDED_VALUE } from '@/appConfig'
import PanelGrid from '@/components/ui/PanelLayoutMaker/PanelGrid'
import { TColorSchema } from '@/lib/schemas/appLogicSchema'
import { TPanelBorderWidth, TPanelGaps, TPanelReadingMode } from '@/types'

export interface Props<T> {
    activationConstraint?: PointerActivationConstraint
    animateLayoutChanges?: AnimateLayoutChanges
    adjustScale?: boolean
    collisionDetection?: CollisionDetection
    coordinateGetter?: KeyboardCoordinateGetter
    dropAnimation?: DropAnimation | null
    getNewIndex?: NewIndexGetter
    handle?: boolean
    items: T[]
    setItems: React.Dispatch<React.SetStateAction<T[]>>
    onNewPanelButtonClick?: () => void
    columns?: number
    borderWidth?: TPanelBorderWidth
    gapX?: TPanelGaps
    gapY?: TPanelGaps
    rounded?: boolean
    backgroundColor?: TColorSchema
    readingMode?: TPanelReadingMode
    getItemId: (item: T) => UniqueIdentifier
    displayItem?: (item: T) => React.ReactNode
    measuring?: MeasuringConfiguration
    modifiers?: Modifiers
    renderItem?: any
    removable?: boolean
    onRemove?(id: UniqueIdentifier): void
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

export function PanelLayoutMaker<T>({
    activationConstraint,
    animateLayoutChanges,
    adjustScale = false,
    collisionDetection = closestCenter,
    coordinateGetter = sortableKeyboardCoordinates,
    dropAnimation = dropAnimationConfig,
    getItemStyles = () => ({}),
    getNewIndex,
    handle = false,
    items = [],
    setItems,
    onNewPanelButtonClick,
    columns,
    borderWidth,
    gapX,
    gapY,
    readingMode,
    rounded,
    backgroundColor,
    getItemId,
    displayItem,
    isDisabled = () => false,
    measuring,
    modifiers,
    removable,
    onRemove,
    renderItem,
    reorderItems = arrayMove,
    strategy = rectSortingStrategy,
    style,
    useDragOverlay = true,
    wrapperStyle = () => ({}),
}: Props<T>) {
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

    const handleRemove = removable
        ? (id: UniqueIdentifier) => {
              setItems((items) =>
                  items.filter((item) => getItemId(item) !== id)
              )
              onRemove?.(id)
          }
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

    const isLayoutUneven =
        columns && columns > 0 && items.length % columns !== 0

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
                    <PanelGrid
                        backgroundColor={backgroundColor}
                        gapX={gapX}
                        gapY={gapY}
                        readingMode={readingMode}
                        columns={columns}
                    >
                        {items.map((value, index) => (
                            <SortablePanel
                                key={getItemId(value)}
                                id={getItemId(value)}
                                handle={handle}
                                index={index}
                                style={getItemStyles}
                                wrapperStyle={wrapperStyle}
                                disabled={isDisabled(getItemId(value))}
                                displayItem={
                                    displayItem ? displayItem(value) : undefined
                                }
                                borderWidth={borderWidth}
                                rounded={rounded}
                                renderItem={renderItem}
                                onRemove={handleRemove}
                                animateLayoutChanges={animateLayoutChanges}
                                useDragOverlay={useDragOverlay}
                                getNewIndex={getNewIndex}
                            />
                        ))}
                        {isLayoutUneven && (
                            <button
                                type="button"
                                className={`flex btn border-0 items-center justify-center w-full h-full p-2 bg-base-200`}
                                style={{
                                    borderRadius: rounded
                                        ? `${PANEL_ROUNDED_VALUE}px`
                                        : undefined,
                                }}
                                onClick={() => {
                                    onNewPanelButtonClick?.()
                                }}
                            >
                                <PlusIcon />
                            </button>
                        )}
                    </PanelGrid>
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
                                  borderWidth={borderWidth}
                                  rounded={rounded}
                                  displayItem={
                                      displayItem
                                          ? displayItem(items[activeIndex])
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
                      document && document.body
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
    borderWidth?: TPanelBorderWidth
    rounded?: boolean
    index: number
    handle: boolean
    displayItem?: React.ReactNode
    useDragOverlay?: boolean
    onRemove?(id: UniqueIdentifier): void
    style(values: any): React.CSSProperties
    renderItem?(args: any): React.ReactElement
    wrapperStyle: Props<any>['wrapperStyle']
}

export function SortablePanel({
    borderWidth,
    rounded,
    disabled,
    animateLayoutChanges,
    getNewIndex,
    handle,
    id,
    displayItem,
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
            displayItem={displayItem}
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
            borderWidth={borderWidth}
            rounded={rounded}
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
