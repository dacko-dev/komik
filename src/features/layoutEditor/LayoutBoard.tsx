'use client'

import LayoutBoardPanel from '@/features/layoutEditor/LayoutBoardPanel'
import { usePanels } from '@/features/layoutEditor/store/usePanels'
import { useSearchParams } from 'next/navigation'
import { Layer, Stage } from 'react-konva'

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

    return (
        <Stage>
            <Layer>
                <div className="border border-base-300 w-[800px] h-[600px]">
                    {panels.map((panel) => (
                        <LayoutBoardPanel key={panel.id} panel={panel} />
                    ))}
                </div>
            </Layer>
        </Stage>
    )
}
