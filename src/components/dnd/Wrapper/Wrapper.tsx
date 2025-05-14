import React from 'react'

interface Props {
    children: React.ReactNode
    center?: boolean
    className?: React.HTMLAttributes<HTMLElement>['className']
    style?: React.CSSProperties
}

export default function Wrapper({ children, style, className, center }: Props) {
    return (
        <div
            style={style}
            className={`flex w-full box-border justify-start ${
                center && 'justify-center'
            }
                ${className}
                `}
        >
            {children}
        </div>
    )
}
