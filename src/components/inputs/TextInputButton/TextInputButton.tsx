import Tooltip from '@/components/ui/Tooltip/Tooltip'
import React, { useId } from 'react'

type InputButtonProps = {
    tooltip?: string
    label: string | React.ReactNode
    labelClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function InputButton({
    tooltip,
    label,
    labelClassName = '',
    ...props
}: InputButtonProps) {
    const id = useId()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className, id: _id, ...restProps } = props

    return (
        <Tooltip tooltip={tooltip}>
            <label
                htmlFor={id}
                id={`${id}-label`}
                className={`btn flex items-center justify-start h-fit gap-0 font-light text-sm border-r-2  border-base-300 cursor-pointer p-0 ${labelClassName}`}
            >
                <div className="border-r-2 border-base-300 p-2 grow-0">
                    {label}
                </div>
                <div className="flex whitespace-nowrap text-sm items-center w-full">
                    <input
                        className={`input input-sm input-ghost w-min rounded-l-none grow ${className}`}
                        id={id}
                        {...restProps}
                    />
                </div>
            </label>
        </Tooltip>
    )
}
