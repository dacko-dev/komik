import React from 'react'

export default function Tooltip({
    tooltip = undefined,
    customTooltip,
    className,
    children,
    ...props
}: {
    tooltip?: string
    customTooltip?: React.ReactNode
    children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`${
                (tooltip || customTooltip) && 'tooltip'
            }  ${className}`}
            data-tip={!customTooltip && tooltip}
            {...props}
        >
            {customTooltip && (
                <div className="tooltip-content">{customTooltip}</div>
            )}
            {children}
        </div>
    )
}
