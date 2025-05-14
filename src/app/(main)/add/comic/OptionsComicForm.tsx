import FieldBox from '@/components/inputs/FieldBox/FieldBox'
import { comicOptionsConfig } from '@/db/schema'
import { capitalizeAll } from '@/lib/utils'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export default function OptionsComicForm<S>({
    fieldLabel,
    className,
    nameInSchema,
}: {
    fieldLabel: string

    className?: string
    nameInSchema: keyof S & string
}) {
    const form = useFormContext()

    const getNameInSchema = (name: string) => {
        return `${nameInSchema}.${name}`
    }

    return (
        <FieldBox className={className} fieldLabel={fieldLabel}>
            <div className="flex  gap-8">
                {/* comicOptionsConfig */}
                {Object.entries(comicOptionsConfig).map(([, option]) => (
                    <Controller
                        key={getNameInSchema(option.name)}
                        control={form.control}
                        name={getNameInSchema(option.name)}
                        render={({ field, fieldState }) => (
                            <label
                                htmlFor={getNameInSchema(option.name)}
                                className={`fieldset-label text-base select-none `}
                            >
                                <input
                                    type="checkbox"
                                    className={`${
                                        fieldState.error ? 'input-error' : ''
                                    } checkbox`}
                                    id={getNameInSchema(option.name)}
                                    {...field}
                                />
                                {capitalizeAll(option.label)}
                            </label>
                        )}
                    />
                ))}

                {/* {options.map((option) => (
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
                ))} */}
            </div>
        </FieldBox>
    )
}
