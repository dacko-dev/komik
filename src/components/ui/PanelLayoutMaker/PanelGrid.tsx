import { TColorSchema, TPanelGap, TReadingMode } from '@/appTypes'
import clsx from 'clsx'

export interface Props {
    children: React.ReactNode
    columns?: number
    gapRow?: TPanelGap
    gapCol?: TPanelGap
    readingMode?: TReadingMode
    backgroundColor?: TColorSchema
    style?: React.CSSProperties
    className?: string
}

export default function PanelGrid({
    children,
    columns = 1,
    gapRow,
    gapCol,
    readingMode,
    backgroundColor,
    style,
    className,
}: Props) {
    return (
        <ul
            className={clsx(
                'grid auto-rows-max transition-colors duration-300 p-2',
                className
                // horizontal ? 'w-full grid-flow-col' : ''
            )}
            style={
                {
                    backgroundColor: backgroundColor,
                    gap: `${gapRow ? gapRow : 0}px ${gapCol ? gapCol : 0}px`,
                    gridTemplateColumns:
                        columns > 1
                            ? `repeat(${columns}, minmax(0, 1fr))`
                            : undefined,
                    direction:
                        readingMode === 'leftToRight'
                            ? 'ltr'
                            : readingMode === 'rightToLeft'
                            ? 'rtl'
                            : 'inherit',

                    ...style,
                } as React.CSSProperties
            }
        >
            {children}
        </ul>
    )
}
