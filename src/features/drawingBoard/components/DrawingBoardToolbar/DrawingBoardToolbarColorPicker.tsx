import {
    DrawingBoardToolbarButton,
    DrawingBoardToolbarButtonProps,
} from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarButton'
import { useRef } from 'react'

interface DrawingBoardToolbarColorPickerProps
    extends Omit<DrawingBoardToolbarButtonProps, 'children'> {
    inputProps?: Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'type' | 'ref'
    >
}

export default function DrawingBoardToolbarColorPicker({
    tooltip,
    isActive = false,
    inputProps,
    ...buttonProps
}: DrawingBoardToolbarColorPickerProps) {
    const ref = useRef<HTMLInputElement>(null)

    return (
        <DrawingBoardToolbarButton
            tooltip={tooltip}
            isActive={isActive}
            {...buttonProps}
            onClick={() => {
                if (ref.current) {
                    ref.current.click()
                }
            }}
        >
            <input
                type="color"
                className=" cursor-pointer w-4 h-4 p-0 rounded-sm border border-base-300"
                ref={ref}
                {...inputProps}
            />
        </DrawingBoardToolbarButton>
    )
}
