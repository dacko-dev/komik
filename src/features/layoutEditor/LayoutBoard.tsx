'use client'

import LayoutBoardPanel from '@/features/layoutEditor/LayoutBoardPanel'
import { usePanels } from '@/features/layoutEditor/store/usePanels'
import {
    DndContext,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { useSearchParams } from 'next/navigation'

export default function LayoutBoard() {
    const searchParams = useSearchParams()
    // const panelId = searchParams.get('panel_id')
    const {
        panels,
        activePanelId,
        addPanel,
        removePanel,
        updatePanel,
        setActivePanel,
        movePanel,
        clearPanels,
    } = usePanels()

    const { isOver, setNodeRef } = useDroppable({
        id: 'layoutBoard',
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                tolerance: 10,
                delay: 100, //  Delay to avoid  conflicts onClick with drag events
            },
        })
    )

    return (
        <DndContext sensors={sensors}>
            <div
                ref={setNodeRef}
                className="border border-base-300 w-[800px] h-[600px]"
            >
                {panels.map((panel) => (
                    <LayoutBoardPanel key={panel.id} panel={panel} />
                ))}
            </div>
        </DndContext>
    )
}
