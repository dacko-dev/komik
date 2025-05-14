import clsx from 'clsx'

interface Props {
    children: React.ReactNode
    columns?: number
    horizontal?: boolean
    ref?: React.Ref<HTMLUListElement>
    className?: React.HTMLAttributes<HTMLElement>['className']
}

export default function Grid({
    children,
    columns = 1,
    horizontal,
    className,
    ref,
}: Props) {
    return (
        <ul
            ref={ref}
            style={
                {
                    '--columns': columns,
                } as React.CSSProperties
            }
            className={clsx(
                'w-full grid auto-rows-max box-border min-w-[350px] gap-4  rounded-[5px] min-h-[200px] transition-colors duration-[350ms] ease-in-out',
                `grid-cols-[repeat(var(--columns,1),minmax(0,1fr))]`,
                "after:content-[''] after:height-[10px] after:col-start-[span var(--columns,1)]",
                horizontal && 'w-full grid-flow-col',
                className
            )}
        >
            {children}
        </ul>
    )
}
