import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export enum Tool {
    SELECT = 'select',
    MOVE = 'move',
    ERASER = 'eraser',
    PENCIL = 'pencil',
    EYEDROPPER = 'eyedropper',
    PAINTBRUSH = 'paintbrush',
    PAINT_BUCKET = 'paint-bucket',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
    HEXAGON = 'hexagon',
    LINE = 'line',
    HEART = 'heart',
    STAR = 'star',
    TEXT = 'text',
    SQUARE_CHAT_BUBBLE = 'square-bubble',
    CIRCLE_CHAT_BUBBLE = 'circle-bubble',
}

interface ToolbarState {
    selectedTool: Tool
    strokeColor: string
    fillColor: string
    strokeWidth: number
    opacity: number
}

interface ToolbarActions {
    setSelectedTool: (tool: Tool) => void
    setStrokeColor: (color: string) => void
    setFillColor: (color: string) => void
    setStrokeWidth: (width: number) => void
    setOpacity: (opacity: number) => void
    reset: () => void
}

export const useToolbar = create(
    combine<ToolbarState, ToolbarActions>(
        {
            selectedTool: Tool.SELECT,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            strokeWidth: 2,
            opacity: 1,
        },
        (set) => ({
            setSelectedTool: (tool) => set({ selectedTool: tool }),
            setStrokeColor: (color) => set({ strokeColor: color }),
            setFillColor: (color) => set({ fillColor: color }),
            setStrokeWidth: (width) => set({ strokeWidth: width }),
            setOpacity: (opacity) => set({ opacity }),
            reset: () =>
                set({
                    selectedTool: Tool.SELECT,
                    strokeColor: '#000000',
                    fillColor: '#ffffff',
                    strokeWidth: 2,
                    opacity: 1,
                }),
        })
    )
)
