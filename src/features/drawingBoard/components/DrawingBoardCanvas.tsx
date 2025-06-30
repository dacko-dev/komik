import React from 'react'
import { Layer, Stage } from 'react-konva'

export default function DrawingBoardCanvas() {
    return (
        <Stage className="w-full h-[3000px] bg-red-300">
            <Layer></Layer>
        </Stage>
    )
}
