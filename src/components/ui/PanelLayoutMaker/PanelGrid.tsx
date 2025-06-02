import { PANEL_GAPS } from '@/appConfig'
import { TColorSchema } from '@/lib/schemas/appLogicSchema'
import { TPanelGaps, TPanelReadingMode } from '@/types'
import clsx from 'clsx'

export interface Props {
    children: React.ReactNode
    columns?: number
    gapX?: TPanelGaps
    gapY?: TPanelGaps
    readingMode?: TPanelReadingMode
    backgroundColor?: TColorSchema
    style?: React.CSSProperties
    className?: string
}

export default function PanelGrid({
    children,
    columns = 1,
    gapX,
    gapY,
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
                    gap: `${gapY && PANEL_GAPS[gapY]} ${
                        gapX && PANEL_GAPS[gapX]
                    }`,
                    gridTemplateColumns:
                        columns > 1
                            ? `repeat(${columns}, minmax(0, 1fr))`
                            : undefined,
                    justifyContent:
                        readingMode === 'ltr'
                            ? 'start'
                            : readingMode === 'rtl'
                            ? 'end'
                            : 'normal',

                    ...style,
                } as React.CSSProperties
            }
        >
            {children}
        </ul>
    )
}
