import clsx from 'clsx'

export interface Props {
    children: React.ReactNode
    columns?: number
    style?: React.CSSProperties
    horizontal?: boolean
}

export default function Grid({
    children,
    columns = 1,
    horizontal,
    style,
}: Props) {
    return (
        <ul
            className={clsx(
                'grid auto-rows-max box-border min-w-[350px] gap-2.5 p-5 pb-0 m-2.5 rounded min-h-[200px] transition-colors duration-300',
                horizontal ? 'w-full grid-flow-col' : ''
            )}
            style={
                {
                    gridTemplateColumns:
                        !horizontal && columns > 1
                            ? `repeat(${columns}, minmax(0, 1fr))`
                            : undefined,
                    ...style,
                } as React.CSSProperties
            }
        >
            {children}
        </ul>
    )
}
