import React, { CSSProperties } from 'react'
import clsx from 'clsx'

export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
    active?: {
        fill: string
        background: string
    }
    cursor?: CSSProperties['cursor']
}

export default function Action({
    active,
    className,
    cursor,
    style,
    ...props
}: ActionProps) {
    return (
        <button
            {...props}
            type="button"
            tabIndex={0}
            style={
                {
                    ...style,
                    cursor,
                    '--fill': active?.fill,
                    '--background': active?.background,
                } as CSSProperties
            }
            className={clsx(
                'flex items-center justify-center',
                'outline-none',
                className
            )}
        />
    )
}
