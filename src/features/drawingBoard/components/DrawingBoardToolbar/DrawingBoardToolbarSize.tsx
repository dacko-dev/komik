import {
    DrawingBoardToolbarButton,
    DrawingBoardToolbarButtonProps,
} from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarButton'
import React, { useState } from 'react'

interface DrawingBoardToolbarSizeProps
    extends Omit<DrawingBoardToolbarButtonProps, 'children'> {
    name: string
    inputProps?: Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'type' | 'ref'
    >
}

export default function DrawingBoardToolbarSize({
    inputProps = {},
    name,
    ...buttonProps
}: DrawingBoardToolbarSizeProps & {
    name: string
}) {
    const { onChange: onInputChange, ...restInputProps } = inputProps

    const [internalValue, setInternalValue] = useState<number>(
        Number(inputProps.defaultValue ?? inputProps.value ?? 100)
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value)
        setInternalValue(newValue)

        // Trigger parent-provided onChange if exists
        if (onInputChange) {
            onInputChange(e)
        }
    }

    return (
        <>
            <DrawingBoardToolbarButton
                type="button"
                popoverTarget={`popover-${name}`}
                style={
                    {
                        anchorName: `--anchor-${name}`,
                    } as React.CSSProperties
                }
                className={`p-0 btn btn-sm `}
                {...buttonProps}
                tooltip={`Size (${internalValue}px)`} // Tooltip showing the current size
            >
                <div className="rounded-full bg-black w-3 h-3 border border-white/20" />
            </DrawingBoardToolbarButton>
            <div
                className="dropdown dropdown-center border-0 menu rounded-box bg-base-300 shadow-sm mt-[2px]"
                popover="auto"
                id={`popover-${name}`}
                style={
                    {
                        positionAnchor: `--anchor-${name}`,
                    } as React.CSSProperties
                }
            >
                <div className="flex flex-col justify-center items-center h-full gap-2">
                    <input
                        step={1}
                        type="range"
                        min="1"
                        max="25"
                        defaultValue="25"
                        className="vertical-lr direction-rtl"
                        onChange={handleChange}
                        {...restInputProps}
                    />
                    <div className="flex justify-center items-center mt-auto">
                        <span className="text-xs text-center">
                            {internalValue}px
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
