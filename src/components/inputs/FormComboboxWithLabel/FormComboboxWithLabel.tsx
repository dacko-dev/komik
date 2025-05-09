import React, { useState, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TFormComboBoxField, TInputOption } from '@/types'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import { CheckIcon, XIcon } from 'lucide-react'

export default function FormComboboxWithLabel<S>({
    nameInSchema,
    fieldLabel,
    fieldDescription,
    labelClassName,
    wrapperClassName,
    options,
    multiple = false,
    ...props
}: TFormComboBoxField<S>) {
    const { control } = useFormContext()
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const filterOptions = (opts: TInputOption[]) => {
        const lower = query.toLowerCase()
        return opts.filter((o) => o.label.toLowerCase().includes(lower))
    }

    return (
        <Controller
            name={nameInSchema}
            control={control}
            render={({ field, fieldState }) => {
                const selected: string[] = multiple
                    ? field.value || []
                    : field.value
                    ? [field.value]
                    : []

                const getLabel = (val: string) =>
                    options.find((opt) => opt.value === val)?.label || val

                const handleSelect = (val: string) => {
                    if (multiple) {
                        if (!selected.includes(val)) {
                            field.onChange([...selected, val])
                        } else {
                            field.onChange(selected.filter((v) => v !== val))
                        }
                    } else {
                        field.onChange(val)
                        setIsOpen(false)
                    }
                    setQuery('')
                }

                const handleRemove = (val: string) => {
                    if (multiple) {
                        field.onChange(selected.filter((v) => v !== val))
                    } else {
                        field.onChange('')
                    }
                }

                return (
                    <fieldset className={`fieldset w-full ${wrapperClassName}`}>
                        <FormFieldLabel
                            fieldLabel={fieldLabel}
                            className={labelClassName}
                        />

                        <div className="dropdown w-full">
                            <div
                                // tabIndex={0}
                                className="input input-bordered w-full gap-0 flex flex-col px-0 cursor-auto h-auto min-h-[var(--size)]"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onFocus={() => setIsOpen(true)}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            const match =
                                                filterOptions(options)[0]
                                            if (match) handleSelect(match.value)
                                        } else if (e.key === 'Escape') {
                                            setIsOpen(false)
                                        }
                                    }}
                                    {...props}
                                    className={`grow bg-transparent input w-full h-[var(--size)] 
                                        focus:outline-none focus:border-none focus:ring-0
                                        ${props.className}`}
                                />

                                {selected.length > 0 && (
                                    <div className="border-t w-full border-dashed border-base-content/20 flex flex-wrap items-center justify-start p-2 gap-2">
                                        {selected.map((val) => (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(val)
                                                }
                                                key={val}
                                                className=" badge badge-lg badge-ghost flex items-center gap-2"
                                            >
                                                {getLabel(val)}

                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isOpen && filterOptions(options).length > 0 && (
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-auto"
                                >
                                    {filterOptions(options).map((option) => (
                                        <li key={option.value}>
                                            <button
                                                type="button"
                                                // className="w-full text-left"
                                                className={`w-full text-left ${
                                                    selected.includes(
                                                        option.value
                                                    )
                                                        ? 'text-secondary'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    handleSelect(option.value)
                                                }
                                            >
                                                {option.label}

                                                {selected.includes(
                                                    option.value
                                                ) && (
                                                    <CheckIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
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
