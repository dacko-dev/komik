import {
    DrawingBoardToolbarButton,
    DrawingBoardToolbarButtonProps,
} from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarButton'
import { DropletIcon } from 'lucide-react'
import React, { useState } from 'react'

interface DrawingBoardToolbarOpacityProps
    extends Omit<DrawingBoardToolbarButtonProps, 'children'> {
    name: string

    inputProps?: Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'type' | 'ref'
    >
}

export default function DrawingBoardToolbarOpacity({
    name,
    inputProps = {},
    ...buttonProps
}: DrawingBoardToolbarOpacityProps) {
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
                tooltip="Opacity"
            >
                <DropletIcon size={16} />
            </DrawingBoardToolbarButton>

            <div
                className="dropdown dropdown-center border-0 menu rounded-box bg-base-300  shadow-none mt-[2px]"
                popover="auto"
                id={`popover-${name}`}
                style={
                    {
                        positionAnchor: `--anchor-${name}`,
                    } as React.CSSProperties
                }
            >
                <div className="flex flex-col justify-center items-center h-full ">
                    <input
                        step={1}
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="100"
                        className="vertical-lr direction-rtl"
                        onChange={handleChange}
                        {...restInputProps}
                    />
                    <div className="flex justify-center items-center mt-auto">
                        <span className="text-xs text-center">
                            {internalValue}%
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
