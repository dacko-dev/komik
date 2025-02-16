'use client'

import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import { TFormTextAreaField } from '@/types'
import { Controller, useFormContext } from 'react-hook-form'

export function FormTextareaWithLabel<S>({
    fieldLabel,
    fieldDescription,
    nameInSchema,
    textareaClassName,
    labelClassName,
    wrapperClassName,
    ...props
}: TFormTextAreaField<S>) {
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
                    <textarea
                        id={nameInSchema}
                        className={`textarea ${
                            fieldState.error ? 'textarea-error' : ''
                        } ${textareaClassName}`}
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
