import {
    PointerSensor,
    useDraggable,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import React, { useRef } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { TLayoutEditorPanel } from '@/features/layoutEditor/schemas/layoutEditorPanelSchema'
import { usePanels } from '@/features/layoutEditor/store/usePanels'
import clsx from 'clsx'

export default function LayoutBoardPanel({
    panel,
}: {
    panel: TLayoutEditorPanel
}) {
    const ref = useRef<HTMLButtonElement>(null)

    const {
        updatePanel,
        removePanel,
        activePanelId,
        setActivePanel,
        // movePanel,
    } = usePanels()

    return (
        <button
            type="button"
            className={clsx('', isDragging ? 'z-100' : 'z-10')}
            ref={ref}
            style={{
                borderWidth: panel.borderWidth,
                borderRadius: panel.borderRadius,
                borderColor: panel.borderColor,
                width: panel.width,
                height: panel.height,
                outline:
                    activePanelId === panel.id
                        ? '2px solid #3b82f6' // blue-500
                        : 'none',
            }}
            onClick={() => {
                // https://github.com/clauderic/dnd-kit/issues/800
                setActivePanel(panel.id)
            }}
        >
            Panel
        </button>
    )
}
