import FieldBox from '@/components/inputs/FieldBox/FieldBox'
import { capitalizeFirst } from '@/lib/utils'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

/*
 * FormFieldBox.tsx
 *
 * This component renders a fieldset with a legend and a group of radio or checkbox inputs.
 * It is used to group related options together in a form.
 *
 * @param {string[]} options - An array of option values for the radio or checkbox inputs.
 * @param {string} fieldLabel - The label for the fieldset.
 * @param {'radio' | 'checkbox'} inputType - The type of input (radio or checkbox).
 * @param {string} [className] - Optional additional class names for styling.
 * @param {keyof S & string} nameInSchema - The name of the field in the schema.
 * @returns {JSX.Element} - A fieldset element containing the legend and input options.
 */

export default function FormFieldBox<S>({
    options,
    fieldLabel,
    inputType,
    className,
    nameInSchema,
}: {
    options: string[]
    fieldLabel: string
    inputType: 'radio' | 'checkbox'
    className?: string
    nameInSchema: keyof S & string
}) {
    const form = useFormContext()

    return (
        <FieldBox fieldLabel={fieldLabel} className={className}>
            <div className="flex gap-8">
                {options.map((option) => (
                    <Controller
                        key={option}
                        control={form.control}
                        name={nameInSchema}
                        render={({ field, fieldState }) => (
                            <label
                                htmlFor={option}
                                key={option}
                                className={`fieldset-label text-base select-none `}
                            >
                                <input
                                    type={inputType}
                                    className={`${
                                        inputType === 'radio'
                                            ? 'radio'
                                            : 'checkbox'
                                    }
                                    ${
                                        fieldState.error ? 'input-error' : ''
                                    }        
                                    `}
                                    id={option}
                                    aria-label={option}
                                    {...field}
                                />
                                {capitalizeFirst(option)}
                            </label>
                        )}
                    />
                ))}
            </div>
        </FieldBox>
    )
}
