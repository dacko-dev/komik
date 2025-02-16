import React from 'react'

export default function FormFieldDescription({
    className,
    fieldDescription,
}: {
    className?: string
    fieldDescription: string | undefined
}) {
    if (!fieldDescription) {
        return null
    }
    return <p className={`fieldset-label ${className}`}>{fieldDescription}</p>
}
