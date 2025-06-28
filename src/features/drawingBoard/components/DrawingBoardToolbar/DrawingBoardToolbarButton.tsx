export interface DrawingBoardToolbarButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    isActive?: boolean
    tooltip: string
}

export function DrawingBoardToolbarButton({
    children,
    tooltip,
    isActive = false,
    ...props
}: DrawingBoardToolbarButtonProps) {
    const { className, ...restProps } = props

    return (
        <div className="tooltip tooltip-bottom  p-0" data-tip={tooltip}>
            <button
                type="button"
                className={`btn btn-square btn-sm ${
                    isActive && 'btn-secondary'
                } ${className}`}
                {...restProps}
            >
                {children}
            </button>
        </div>
    )
}
