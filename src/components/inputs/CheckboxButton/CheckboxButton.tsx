import Tooltip from '@/components/ui/Tooltip/Tooltip'
import React, { useId } from 'react'

type CheckboxButtonProps = {
    tooltip?: string
    label: string | React.ReactNode
    labelClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function CheckboxButton({
    tooltip,
    label,
    labelClassName = '',
    ...props
}: CheckboxButtonProps) {
    const id = useId()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className, type: _type, id: _id, ...restProps } = props

    return (
        <Tooltip tooltip={tooltip}>
            <label
                htmlFor={id}
                id={`${id}-label`}
                className={`btn flex items-center h-fit gap-0 font-light text-sm border-r-2  border-base-300 cursor-pointer p-0 ${labelClassName}`}
            >
                <div className="border-r-2 border-base-300 p-2">{label}</div>
                <div className="flex whitespace-nowrap text-sm p-2 items-center">
                    <input
                        className={`checkbox checkbox-xs ${className}`}
                        type="checkbox"
                        id={id}
                        {...restProps}
                    />
                </div>
            </label>
        </Tooltip>
    )
}
