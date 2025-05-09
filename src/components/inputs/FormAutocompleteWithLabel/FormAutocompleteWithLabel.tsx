import React, { useCallback, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import { TFormAutocompleteInputField } from '@/types'
import Autocomplete from '@/components/inputs/Autocomplete/Autocomplete'

// TODO - add suggestion box in a dropdown if browser does not support datalist
export default function FormAutocompleteWithLabel<S>({
    fieldLabel,
    fieldDescription,
    nameInSchema,
    labelClassName,
    wrapperClassName,
    suggestions,
    onSuggestionClick,
    datalistProps,
    inputProps,
}: TFormAutocompleteInputField<S>) {
    const form = useFormContext()
    const [localSuggestions, setLocalSuggestions] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

    const fetchSuggestions = useCallback(
        async (query: string) => {
            if (typeof suggestions === 'function') {
                setLoading(true)
                try {
                    const results = await suggestions(query)
                    setLocalSuggestions(results)
                } catch (err) {
                    console.error('Failed to load suggestions', err)
                    setLocalSuggestions([])
                } finally {
                    setLoading(false)
                }
            }
        },
        [suggestions]
    )

    return (
        <Controller
            control={form.control}
            name={nameInSchema}
            render={({ field, fieldState }) => (
                <fieldset className={`fieldset relative ${wrapperClassName}`}>
                    <FormFieldLabel
                        fieldLabel={fieldLabel}
                        htmlFor={nameInSchema}
                        className={labelClassName}
                    />
                    <Autocomplete
                        datalistProps={{
                            ...datalistProps,
                            id: datalistProps?.id || `${nameInSchema}-datalist`,
                        }}
                        inputProps={{
                            id: nameInSchema,
                            ...inputProps,
                            ...field,
                            className: `input ${
                                fieldState.error ? 'input-error' : ''
                            } ${inputProps?.className}`,
                            onChange: (e) => {
                                const value = e.target.value
                                field.onChange(value)

                                if (typeof suggestions === 'function') {
                                    if (debounceTimeout.current) {
                                        clearTimeout(debounceTimeout.current)
                                    }

                                    debounceTimeout.current = setTimeout(() => {
                                        fetchSuggestions(value)
                                    }, 300)
                                }
                            },
                        }}
                        suggestions={
                            typeof suggestions === 'function'
                                ? localSuggestions
                                : suggestions
                        }
                        loading={loading}
                        onSuggestionClick={(suggestion: string) => {
                            if (onSuggestionClick) {
                                onSuggestionClick(suggestion)
                            }
                            field.onChange(suggestion)
                        }}
                    />

                    {/* <div className="relative">
                        <input
                            type="text"
                            className={`input ${
                                fieldState.error ? 'input-error' : ''
                            } ${inputClassName} pr-10`} // space for spinner
                            list={datalistId}
                            {...field}
                            {...props}
                            onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value)

                                if (typeof suggestions === 'function') {
                                    if (debounceTimeout.current) {
                                        clearTimeout(debounceTimeout.current)
                                    }

                                    debounceTimeout.current = setTimeout(() => {
                                        fetchSuggestions(value)
                                    }, 300)
                                }
                            }}
                        />
                        {loading && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <span className="loading loading-spinner loading-md"></span>
                            </div>
                        )}
                    </div>
                    {suggestions && (
                        <datalist id={datalistId}>
                            {(typeof suggestions === 'function'
                                ? localSuggestions
                                : suggestions
                            ).map((suggestion) => (
                                <option
                                    key={suggestion}
                                    value={suggestion}
                                    onClick={() => {
                                        if (onSuggestionClick) {
                                            onSuggestionClick(suggestion)
                                        }
                                    }}
                                />
                            ))}
                        </datalist>
                    )} */}
                    <FormFieldDescription fieldDescription={fieldDescription} />
                    <FormFieldError fieldError={fieldState.error?.message} />
                </fieldset>
            )}
        />
    )
}
