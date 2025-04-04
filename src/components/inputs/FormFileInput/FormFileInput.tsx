'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { useRef, useState, useCallback, InputHTMLAttributes } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'

type Props<S> = {
    fieldLabel: string
    fieldDescription?: string
    nameInSchema: keyof S & string
    inputClassName?: string
    labelClassName?: string
    wrapperClassName?: string
    minFileSize?: number // Optional: Enforce minimum file size
    maxFileSize?: number // Optional: Enforce maximum file size
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>

export function FileInputWithLabel<S>({
    fieldLabel,
    fieldDescription,
    nameInSchema,
    inputClassName,
    labelClassName,
    wrapperClassName,
    minFileSize,
    maxFileSize,
    ...props
}: Props<S>) {
    const form = useFormContext()
    const [isDragging, setIsDragging] = useState(false)
    const dropElementRef = useRef<HTMLDivElement>(null)

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (
            dropElementRef.current &&
            !dropElementRef.current.contains(event.relatedTarget as Node)
        ) {
            setIsDragging(false)
        }
    }, [])

    const handleDrop = useCallback(
        (event: React.DragEvent, fieldOnChange: (files: File[]) => void) => {
            event.preventDefault()
            event.stopPropagation()
            setIsDragging(false)

            if (!event.dataTransfer.files.length) return

            const oldFiles = form.getValues(nameInSchema) || []
            const newFiles = Array.from(event.dataTransfer.files).filter(
                (file) =>
                    !oldFiles.some(
                        (existingFile: File) => existingFile.name === file.name
                    ) &&
                    (!minFileSize || file.size >= minFileSize) &&
                    (!maxFileSize || file.size <= maxFileSize)
            )

            fieldOnChange([...oldFiles, ...newFiles])
        },
        [form, nameInSchema, minFileSize, maxFileSize]
    )

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
                    <div
                        ref={dropElementRef}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            document.getElementById(nameInSchema)?.click()
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, field.onChange)}
                        className={`w-full h-52 p-8 border-2 border-dotted rounded-md flex items-center justify-center flex-col gap-4 bg-card ${
                            isDragging ? 'border-primary' : ''
                        }`}
                    >
                        {!isDragging ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                >
                                    <label
                                        htmlFor={nameInSchema}
                                        tabIndex={0}
                                        className="cursor-pointer select-none"
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === ' '
                                            ) {
                                                event.preventDefault()
                                                document
                                                    .getElementById(
                                                        nameInSchema
                                                    )
                                                    ?.click()
                                            }
                                        }}
                                    >
                                        Attach <ImageIcon />
                                    </label>
                                </button>
                                <p className="opacity-70 select-none">
                                    Drag images here or click to upload
                                </p>
                            </>
                        ) : (
                            <div className="opacity-70 select-none flex items-center justify-center flex-col gap-4">
                                <Upload size={40} />
                                <p>Drop here</p>
                            </div>
                        )}
                    </div>

                    <input
                        id={nameInSchema}
                        type="file"
                        className={`hidden ${inputClassName}`}
                        {...props}
                        onChange={(event) => {
                            if (!event.target.files?.length) return
                            const newFiles = Array.from(
                                event.target.files
                            ).filter(
                                (file) =>
                                    (!minFileSize ||
                                        file.size >= minFileSize) &&
                                    (!maxFileSize || file.size <= maxFileSize)
                            )
                            field.onChange(newFiles)
                        }}
                    />

                    <FormFieldDescription fieldDescription={fieldDescription} />
                    <FormFieldError fieldError={fieldState.error?.message} />
                </fieldset>
            )}
        />
    )
}
