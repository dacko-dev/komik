import React from 'react'
import clsx from 'clsx'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    center?: boolean
    style?: React.CSSProperties
}

export default function Wrapper({ children, className, style }: Props) {
    return (
        <div className={clsx(className)} style={style}>
            {children}
        </div>
    )
}
