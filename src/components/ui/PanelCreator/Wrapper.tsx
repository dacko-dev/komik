/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx'

interface Props {
    children: React.ReactNode
    center?: boolean
    style?: React.CSSProperties
}

export default function Wrapper({ children, center, style }: Props) {
    return (
        <div
            // className={clsx(styles.Wrapper, center && styles.center)}
            style={style}
        >
            {children}
        </div>
    )
}
