import DrawingBoardToolbarColorPicker from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarColorPicker'
import { DrawingBoardToolbarSelect } from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarSelect'
import { DrawAction } from '@/contexts/drawingBoardContext'
import {
    CircleIcon,
    EraserIcon,
    HeartIcon,
    HexagonIcon,
    MessageCircleIcon,
    MessageSquareIcon,
    MinusIcon,
    MousePointer2Icon,
    MoveIcon,
    PaintbrushIcon,
    PaintBucket,
    PencilIcon,
    SquareIcon,
    StarIcon,
    TypeIcon,
} from 'lucide-react'
import { useState } from 'react'
import { DrawingBoardToolbarButton } from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarButton'
import DrawingBoardToolbarOpacity from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarOpacity'
import DrawingBoardToolbarSize from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarSize'

const selectionToolOptions = [
    {
        label: 'Select',
        icon: <MousePointer2Icon size={16} />,
        value: DrawAction.SELECT,
        tooltip: 'Select',
    },
    {
        label: 'Move',
        icon: <MoveIcon size={16} />,
        value: DrawAction.MOVE,
        tooltip: 'Move',
    },
]

const shapeToolOptions = [
    {
        label: 'Circle',
        icon: <CircleIcon size={16} />,
        value: DrawAction.CIRCLE,
        tooltip: 'Circle',
    },
    {
        label: 'Rectangle',
        icon: <SquareIcon size={16} />,
        value: DrawAction.RECTANGLE,
        tooltip: 'Rectangle',
    },
    {
        label: 'Hexagon',
        icon: <HexagonIcon size={16} />,
        value: DrawAction.HEXAGON,
        tooltip: 'Hexagon',
    },
    {
        label: 'Line',
        icon: <MinusIcon size={16} />,
        value: DrawAction.LINE,
        tooltip: 'Line',
    },
    {
        label: 'Heart',
        icon: <HeartIcon size={16} />,
        value: DrawAction.HEART,
        tooltip: 'Heart',
    },
    {
        label: 'Star',
        icon: <StarIcon size={16} />,
        value: DrawAction.STAR,
        tooltip: 'Star',
    },
]

const drawingToolOptions = [
    {
        label: 'Pencil',
        icon: <PencilIcon size={16} />,
        value: DrawAction.PENCIL,
        tooltip: 'Pencil',
    },
    {
        label: 'Paintbrush',
        icon: <PaintbrushIcon size={16} />,
        value: DrawAction.PAINTBRUSH,
        tooltip: 'Paintbrush',
    },
    {
        label: 'Paint Bucket',
        icon: <PaintBucket size={16} />,
        value: DrawAction.PAINT_BUCKET,
        tooltip: 'Bucket',
    },
]

const chatToolOptions = [
    {
        label: 'Square Chat Bubble',
        icon: <MessageSquareIcon size={16} />,
        value: DrawAction.SQUARE_CHAT_BUBBLE,
        tooltip: 'Square Bubble',
    },
    {
        label: 'Round Chat Bubble',
        icon: <MessageCircleIcon size={16} />,
        value: DrawAction.CIRCLE_CHAT_BUBBLE,
        tooltip: 'Circle Bubble',
    },
]

export default function DrawingBoardToolbar() {
    const [selectedTool, setSelectedTool] = useState<DrawAction>(
        DrawAction.SELECT
    )

    const handleToolChange = (tool: DrawAction) => {
        setSelectedTool(tool)
        console.log('Selected tool:', tool)
    }

    return (
        <div className="sticky -mb-6 top-0  z-10 flex justify-center py-2 w-full gap-4 pointer-events-none">
            <ul className="flex gap-2 p-2 rounded-box bg-base-300 pointer-events-auto">
                <li>
                    <DrawingBoardToolbarSize name="size-tool" tooltip="Size" />
                </li>
                <li>
                    <DrawingBoardToolbarColorPicker tooltip="Color Picker" />
                </li>
                <li>
                    <DrawingBoardToolbarOpacity
                        name="opacity-tool"
                        tooltip="Opacity"
                        inputProps={{
                            onChange: (e) => {
                                const value = e.target.value
                                console.log('Opacity changed:', value)
                            },
                        }}
                    />
                </li>
            </ul>

            <ul className="flex gap-2 p-2 rounded-box bg-base-300 pointer-events-auto">
                <li>
                    <DrawingBoardToolbarSelect
                        name="selection-tool"
                        options={selectionToolOptions}
                        activeOption={selectedTool}
                        isActive={selectionToolOptions.some(
                            (opt) => opt.value === selectedTool
                        )}
                        onChange={(value) => {
                            handleToolChange(value)
                        }}
                    />
                </li>

                <li>
                    <DrawingBoardToolbarButton
                        tooltip="Eraser"
                        isActive={selectedTool === DrawAction.ERASER}
                        onClick={() => {
                            handleToolChange(DrawAction.ERASER)
                        }}
                    >
                        <EraserIcon size={16} />
                    </DrawingBoardToolbarButton>
                </li>

                <li>
                    <DrawingBoardToolbarSelect
                        name="drawing-tool"
                        options={drawingToolOptions}
                        activeOption={selectedTool}
                        isActive={drawingToolOptions.some(
                            (opt) => opt.value === selectedTool
                        )}
                        onChange={(value) => {
                            handleToolChange(value)
                        }}
                    />
                </li>
                <li>
                    <DrawingBoardToolbarSelect
                        options={shapeToolOptions}
                        name="shape-select"
                        activeOption={selectedTool}
                        isActive={shapeToolOptions.some(
                            (opt) => opt.value === selectedTool
                        )}
                        onChange={(value) => {
                            handleToolChange(value)
                        }}
                    />
                </li>
                <li>
                    <DrawingBoardToolbarButton
                        tooltip="Text"
                        isActive={selectedTool === DrawAction.TEXT}
                        onClick={() => {
                            handleToolChange(DrawAction.TEXT)
                        }}
                    >
                        <TypeIcon size={16} />
                    </DrawingBoardToolbarButton>
                </li>

                <li>
                    <DrawingBoardToolbarSelect
                        options={chatToolOptions}
                        name="chat-tool"
                        activeOption={selectedTool}
                        isActive={chatToolOptions.some(
                            (opt) => opt.value === selectedTool
                        )}
                        onChange={(value) => {
                            handleToolChange(value)
                        }}
                    />
                </li>
            </ul>
        </div>
    )
}
