'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { TFormSelectField } from '@/types'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'

export function FormSelect<S>({
    fieldLabel,
    fieldDescription,
    nameInSchema,
    selectClassName,
    options,
    labelClassName,
    wrapperClassName,
    ...props
}: TFormSelectField<S>) {
    const form = useFormContext()

    return (
        <Controller
            control={form.control}
            name={nameInSchema}
            render={({ field, fieldState }) => (
                <fieldset className={`fieldset ${wrapperClassName}`}>
                    {fieldLabel && (
                        <FormFieldLabel
                            fieldLabel={fieldLabel}
                            htmlFor={nameInSchema}
                            className={labelClassName}
                        />
                    )}
                    <select
                        id={nameInSchema}
                        className={`select ${
                            fieldState.error ? 'select-error' : ''
                        } ${selectClassName}`}
                        {...props}
                        {...field}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <FormFieldDescription fieldDescription={fieldDescription} />
                    <FormFieldError fieldError={fieldState.error?.message} />
                </fieldset>
            )}
        />
    )
}
