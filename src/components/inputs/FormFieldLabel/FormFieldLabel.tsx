import React from 'react'

export default function FormFieldLabel({
    fieldLabel,
    htmlFor,
    className,
}: {
    fieldLabel: string | React.ReactNode
    htmlFor?: string
    className?: string
}) {
    return (
        <label className={`fieldset-legend p-0 ${className}`} htmlFor={htmlFor}>
            {fieldLabel}
        </label>
    )
}
