'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { useRef, useState, useCallback, InputHTMLAttributes } from 'react'
import { Upload, Image as ImageIcon, TrashIcon } from 'lucide-react'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import Image from 'next/image'

type Props<S> = {
    fieldLabel: string
    fieldDescription?: string
    nameInSchema: keyof S & string
    inputClassName?: string
    labelClassName?: string
    wrapperClassName?: string
    maxFileSize?: number // in bytes
    maxFileCount?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>

export function FormFileInputDNDWithLabel<S>({
    fieldLabel,
    fieldDescription,
    nameInSchema,
    inputClassName,
    labelClassName,
    wrapperClassName,
    maxFileSize,
    maxFileCount,
    ...props
}: Props<S>) {
    const form = useFormContext()
    const [isDragging, setIsDragging] = useState(false)
    const dropElementRef = useRef<HTMLDivElement>(null)

    // const checkForErrors = useCallback(
    //     (files: File[]) => {
    //         let isError = false

    //         if (maxFileCount && files.length > maxFileCount) {
    //             isError = true
    //             form.setError(
    //                 nameInSchema,
    //                 {
    //                     type: 'maxLength',
    //                     message: `You can only upload a maximum of ${maxFileCount} ${
    //                         maxFileCount > 1 ? 'files' : 'file'
    //                     }.`,
    //                 },
    //                 { shouldFocus: true }
    //             )
    //         }

    //         if (maxFileSize) {
    //             const totalSize = files.reduce(
    //                 (acc, file) => acc + file.size,
    //                 0
    //             )
    //             if (totalSize > maxFileSize) {
    //                 isError = true
    //                 form.setError(
    //                     nameInSchema,
    //                     {
    //                         type: 'max',
    //                         message: `The total file size exceeds the maximum limit of ${byteToKb(
    //                             maxFileSize
    //                         )} KB.`,
    //                     },
    //                     { shouldFocus: true }
    //                 )
    //             }
    //         }
    //         return isError
    //     },
    //     [form, nameInSchema, maxFileSize, maxFileCount]
    // )

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
                    (!maxFileSize || file.size <= maxFileSize)
            )

            fieldOnChange([...oldFiles, ...newFiles])
        },
        [form, nameInSchema, maxFileSize]
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
                        className={`w-full grow  p-0 overflow-hidden border-2 border-dotted input flex items-center justify-center flex-col min-h-52 h-full ${
                            isDragging ? 'bg-base-200' : ''
                        }`}
                    >
                        <div
                            className={`flex items-center justify-center flex-col gap-4 py-16 ${
                                isDragging && 'opacity-70 select-none'
                            }`}
                        >
                            {isDragging ? (
                                <div className="opacity-70 select-none flex flex-col items-center">
                                    <Upload size={40} />
                                    <p>
                                        Drop
                                        {maxFileCount && maxFileCount > 1
                                            ? ` ${maxFileCount} files`
                                            : ' file'}{' '}
                                        here
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                    >
                                        <label
                                            htmlFor={nameInSchema}
                                            tabIndex={-1}
                                            className="cursor-pointer select-none flex items-center gap-2"
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
                                </div>
                            )}
                        </div>

                        {field.value && field.value.length > 0 && (
                            <div
                                className="
                                border-t-2 border-dotted border-[var(--input-color)] 
                       grid grid-cols-2 gap-2 sm:grid-cols-3
                       bg-base-200 w-full grow p-2"
                            >
                                {Array.isArray(field.value) &&
                                    field.value.map(
                                        (file: File, index: number) => (
                                            <div
                                                key={index}
                                                className="w-36 h-36 flex self-center justify-self-center items-center justify-between group rounded-lg overflow-hidden relative"
                                            >
                                                {file.type.startsWith(
                                                    'image/'
                                                ) ? (
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        alt={file.name}
                                                        className="w-full h-full object-cover"
                                                        width={100}
                                                        height={100}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Upload size={40} />
                                                    </div>
                                                )}

                                                <div className="flex transition-all select-none flex-col group-hover:opacity-100 opacity-0 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                                    <span className="text-sm font-semibold">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <button
                                                    className="btn btn-xs btn-square hover:btn-error btn-neutral absolute top-1 right-1"
                                                    type="button"
                                                    onClick={() => {
                                                        const newFiles =
                                                            field.value.filter(
                                                                (f: File) =>
                                                                    f.name !==
                                                                    file.name
                                                            )
                                                        field.onChange(newFiles)
                                                    }}
                                                >
                                                    <TrashIcon
                                                        // className="w-4 h-4"
                                                        size={16}
                                                    />
                                                </button>
                                            </div>
                                        )
                                    )}
                            </div>
                        )}
                    </div>

                    <input
                        id={nameInSchema}
                        type="file"
                        className={`hidden ${inputClassName}`}
                        {...props}
                        multiple={maxFileCount !== 1 || props.multiple}
                        onChange={(event) => {
                            if (!event.target.files?.length) return
                            const newFiles = Array.from(
                                event.target.files
                            ).filter(
                                (file) =>
                                    !maxFileSize || file.size <= maxFileSize
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
