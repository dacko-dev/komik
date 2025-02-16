import React from 'react'

export default function FormFieldLabel({
    fieldLabel,
    htmlFor,
    className,
}: {
    fieldLabel: string
    htmlFor: string
    className?: string
}) {
    return (
        <label className={`fieldset-legend ${className}`} htmlFor={htmlFor}>
            {fieldLabel}
        </label>
    )
}
