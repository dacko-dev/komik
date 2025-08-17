import React, { useRef } from 'react'
import { TLayoutEditorPanel } from '@/features/layoutEditor/schemas/layoutEditorPanelSchema'
import { usePanels } from '@/features/layoutEditor/store/usePanels'
import clsx from 'clsx'
import { Line, RegularPolygon } from 'react-konva'

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
        // https://konvajs.org/api/Konva.Line.html
        <Line
            draggable={true}
            points={[73, 192, 73, 160, 340, 23, 500, 109, 499, 139, 342, 93]}
            // fill={panel.backgroundColor}
            stroke={panel.borderColor}
            strokeWidth={panel.borderWidth}
            closed
        >
            <button
                type="button"
                className={clsx('')}
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
        </Line>
    )
}
