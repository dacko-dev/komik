/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { CSSProperties } from 'react'

export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
    active?: {
        fill: string
        background: string
    }
    cursor?: CSSProperties['cursor']
    ref?: React.Ref<HTMLButtonElement>
}

export default function Action({
    active,
    className,
    cursor,
    style,
    ref,
    ...props
}: ActionProps) {
    return (
        <button
            ref={ref}
            {...props}
            className={`btn btn-square btn-xs ${className}`}
            tabIndex={0}
            style={
                {
                    ...style,
                    cursor,
                    // '--fill': active?.fill,
                    // '--background': active?.background,
                } as CSSProperties
            }
        />
    )
}
