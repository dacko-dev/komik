import FieldBox from '@/components/inputs/FieldBox/FieldBox'
import { capitalizeAll } from '@/lib/utils'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export default function OptionsComicForm<S>({
    fieldLabel,
    options,
    className,
}: {
    fieldLabel: string
    options: {
        label: string
        nameInSchema: keyof S & string
    }[]
    className?: string
}) {
    const form = useFormContext()
    return (
        <FieldBox className={className} fieldLabel={fieldLabel}>
            <div className="flex  gap-8">
                {options.map((option) => (
                    <Controller
                        key={option.nameInSchema}
                        control={form.control}
                        name={option.nameInSchema}
                        render={({ field, fieldState }) => (
                            <label
                                htmlFor={option.nameInSchema}
                                key={option.nameInSchema}
                                className={`fieldset-label text-base select-none `}
                            >
                                <input
                                    type="checkbox"
                                    className={`${
                                        fieldState.error ? 'input-error' : ''
                                    } checkbox`}
                                    id={option.nameInSchema}
                                    {...field}
                                />
                                {capitalizeAll(option.label)}
                            </label>
                        )}
                    />
                ))}

                {/* <label className="fieldset-label text-base select-none">
                    <input type="checkbox" className="checkbox" />
                    Disable Comments

                {/* <label className="fieldset-label text-base select-none">
                    <input type="checkbox" className="checkbox" />
                    Disable Comments
                </label>

                <label className="fieldset-label text-base select-none">
                    <input type="checkbox" className="checkbox" />
                    Draw Over
                </label> */}
            </div>
        </FieldBox>
    )
}
