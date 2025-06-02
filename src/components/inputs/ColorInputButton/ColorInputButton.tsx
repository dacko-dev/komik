import React, { useId } from 'react'

type ColorInputButtonProps = {
    label: string | React.ReactNode
    labelClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function ColorInputButton({
    label,
    labelClassName = '',
    ...props
}: ColorInputButtonProps) {
    const id = useId()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className, type: _type, id: _id, ...restProps } = props

    return (
        <label
            htmlFor={id}
            id={`${id}-label`}
            className={`btn flex items-center h-fit gap-0 font-light text-sm border-r-2  border-base-300 cursor-pointer p-0 ${labelClassName}`}
        >
            <div className="border-r-2 border-base-300 p-2">{label}</div>
            <div className="flex whitespace-nowrap text-sm px-2 items-center">
                <input
                    className={`h-6 border-0 ${className}`}
                    type="color"
                    id={id}
                    {...restProps}
                />
            </div>
        </label>
    )
}
