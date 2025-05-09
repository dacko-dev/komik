import { capitalizeAll } from '@/lib/utils'
import React from 'react'

/*
 * FormFieldBoxInputLabel.tsx
 *
 * This component renders a label for a radio or checkbox input field.
 * It is used in the FormFieldBox component, but can be used independently.
 *
 * @param {string} option - The visibility option (e.g., "public", "private").
 * @returns {JSX.Element} - A label element containing a radio input and the option text.
 */

export default function FieldBox({
    fieldLabel,
    className,
    children,
}: {
    fieldLabel: string
    className?: string
    children?: React.ReactNode
}) {
    return (
        <fieldset
            className={`fieldset bg-base-200 border border-base-300 p-4 rounded-field w-full ${className}`}
        >
            <legend className="fieldset-legend select-none p-0">
                {capitalizeAll(fieldLabel)}
            </legend>
            {children}
        </fieldset>
    )
}
