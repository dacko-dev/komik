/* eslint-disable @typescript-eslint/no-unused-vars */
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
            // className={clsx(styles.Action, className)}
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
                'flex w-3 p-[15px] items-center justify-center',
                'cursor-pointer rounded flex border-none outline-none',
                'btn-sm btn-ghost'
                // 'bg-transparent',
                // 'hover:bg-[var(--action-background,rgba(0,0,0,0.05))]',
                // 'active:bg-[var(--background,rgba(0,0,0,0.05))]',
                // 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
                // 'focus-visible:ring-[#4c9ffe]'
            )}
        />
    )
}
