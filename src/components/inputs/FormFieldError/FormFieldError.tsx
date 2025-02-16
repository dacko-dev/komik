import React from 'react'

export default function FormFieldError({
    fieldError,
}: {
    fieldError: string | undefined
}) {
    if (!fieldError) {
        return null
    }
    return <p className="text-error">{fieldError}</p>
}
