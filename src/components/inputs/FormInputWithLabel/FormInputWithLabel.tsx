'use client'

import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import { TFormInputField } from '@/types'
import { Controller, useFormContext } from 'react-hook-form'

export function FormInputWithLabel<S>({
    fieldLabel,
    fieldDescription,
    nameInSchema,
    inputClassName,
    labelClassName,
    wrapperClassName,
    ...props
}: TFormInputField<S>) {
    const form = useFormContext()

    return (
        <Controller
            control={form.control}
            name={nameInSchema}
            render={({ field, fieldState }) => (
                <fieldset className={`fieldset ${wrapperClassName}`}>
                    <FormFieldLabel
                        fieldLabel={fieldLabel}
                        htmlFor={nameInSchema}
                        className={labelClassName}
                    />
                    <input
                        id={nameInSchema}
                        className={`input ${
                            fieldState.error ? 'input-error' : ''
                        } ${inputClassName}`}
                        {...props}
                        {...field}
                    />
                    <FormFieldDescription fieldDescription={fieldDescription} />
                    <FormFieldError fieldError={fieldState.error?.message} />
                </fieldset>
            )}
        />
    )
}
