import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TFormTagInputField } from '@/types'
import Autocomplete from '@/components/inputs/Autocomplete/Autocomplete'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import { PlusIcon } from 'lucide-react'
import TagsDisplay from '@/components/inputs/FormTagInput/TagsDisplay'

export default function FormTagInput<S>({
    fieldLabel,
    fieldDescription,
    nameInSchema,
    wrapperClassName,
    labelClassName,
}: TFormTagInputField<S>) {
    const form = useFormContext()
    const [inputValue, setInputValue] = useState('')

    const [localSuggestions, setLocalSuggestions] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const suggestions = useCallback(async (query: string) => {
        return new Promise<string[]>((resolve) => {
            setTimeout(() => {
                resolve(
                    ['abc', 'def', 'Tag3'].filter((tag) => tag.includes(query))
                )
            }, 500)
        })
    }, [])

    const fetchSuggestions = useCallback(
        async (query: string) => {
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
        },
        [suggestions]
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        if (e.target.value || e.target.value.length === 0) {
            setLocalSuggestions([])
        }
    }

    useEffect(() => {
        const delay = 200 // milliseconds
        const handler = setTimeout(() => {
            if (inputValue) {
                fetchSuggestions(inputValue)
            } else {
                setLocalSuggestions([])
            }
        }, delay)

        return () => clearTimeout(handler)
    }, [inputValue, fetchSuggestions])

    return (
        <Controller
            control={form.control}
            name={nameInSchema}
            render={({ field, fieldState }) => {
                const tags: string[] = field.value || []

                const addTag = (tag: string) => {
                    const trimmed = tag.trim()
                    if (trimmed && !tags.includes(trimmed)) {
                        field.onChange([...tags, trimmed])
                    }
                    setInputValue('')
                }

                const removeTag = (tag: string) => {
                    field.onChange(tags.filter((t) => t !== tag))
                }

                return (
                    <fieldset className={`fieldset ${wrapperClassName}`}>
                        <FormFieldLabel
                            htmlFor={nameInSchema}
                            fieldLabel={fieldLabel}
                            className={labelClassName}
                        />
                        <div>
                            <div className="flex items-center gap-2 w-full">
                                <Autocomplete
                                    wrapperClassName="w-full"
                                    inputProps={{
                                        value: inputValue,
                                        onChange: handleInputChange,
                                        className: 'w-full',
                                        placeholder: 'Add a tag',
                                        list: `${nameInSchema}-datalist`,
                                    }}
                                    datalistProps={{
                                        id: `${nameInSchema}-datalist`,
                                    }}
                                    suggestions={localSuggestions}
                                    loading={loading}
                                    onSuggestionClick={() => {
                                        setLocalSuggestions([])
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-square ml-2"
                                    onClick={() => {
                                        setInputValue('')
                                        setLocalSuggestions([])
                                        addTag(inputValue)
                                    }}
                                >
                                    <PlusIcon
                                        className="w-6 h-6"
                                        strokeWidth={2}
                                    />
                                </button>
                            </div>
                            {field.value && (
                                <TagsDisplay
                                    tags={field.value}
                                    onTagClick={(tag: string) => {
                                        removeTag(tag)
                                    }}
                                />
                            )}
                        </div>

                        <FormFieldDescription
                            fieldDescription={fieldDescription}
                        />

                        <FormFieldError
                            fieldError={fieldState.error?.message}
                        />
                    </fieldset>
                )
            }}
        />
    )
}
