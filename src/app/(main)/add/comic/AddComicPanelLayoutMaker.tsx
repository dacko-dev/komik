/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    TAddComicForm,
    TAddComicPanel,
} from '@/app/(main)/add/comic/AddComicForm'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import PanelLayoutMaker from '@/components/ui/PanelLayoutMaker/PanelLayoutMaker'
import { FILE_ACCEPTED_TYPES } from '@/constants'
import { fileSchema } from '@/lib/schemas/appLogicSchema'
import { TFormField } from '@/types'
import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function AddComicPanelLayoutMaker<S>({
    fieldLabel,
    fieldDescription,
    labelClassName,
    wrapperClassName,
}: Omit<TFormField<S>, 'nameInSchema'>) {
    const form = useFormContext<TAddComicForm>()

    const inputRef = React.useRef<HTMLInputElement>(null)
    const [panels, setPanels] = React.useState<TAddComicPanel[]>([])

    const handleFiles = useCallback(
        (files: FileList | File[] | null) => {
            if (!files) return

            const parsedFiles: File[] = []
            Array.from(files).forEach((file) => {
                const result = fileSchema.safeParse(file)
                if (!result.success) {
                    console.log('error', result.error.issues[0].message)
                    toast.error(
                        result.error.issues[0].message ||
                            `File ${file.name} is invalid`
                    )
                    return
                }
                parsedFiles.push(file)
            })

            const newPanels: TAddComicPanel[] = []

            Array.from(parsedFiles).forEach((file, index) => {
                const reader = new FileReader()

                reader.onload = (event) => {
                    const previewUrl = event.target?.result as string
                    const newPanel: TAddComicPanel = {
                        id: crypto.randomUUID(),
                        file,
                        previewUrl,
                        order: panels.length + newPanels.length, // continue from existing length
                    }

                    setPanels((prev) => {
                        const updated = [...prev, newPanel]
                        form.setValue('panels', updated)
                        return updated
                    })
                }

                reader.readAsDataURL(file)
            })
        },
        [form, panels]
    )
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            handleFiles(files)
        },
        [handleFiles]
    )

    const handlePanelRemove = useCallback(
        (id: string) => {
            setPanels((prev) => {
                const updated = prev.filter((panel) => panel.id !== id)
                form.setValue('panels', updated)
                return updated
            })
        },
        [form]
    )
    const handlePanelOrderChange = useCallback(
        (oldIndex: number, newIndex: number) => {
            setPanels((prev) => {
                const updated = [...prev]
                const [movedPanel] = updated.splice(oldIndex, 1)
                updated.splice(newIndex, 0, movedPanel)
                updated.forEach((panel, index) => {
                    panel.order = index
                })
                form.setValue('panels', updated)
                return updated
            })
        },
        [form]
    )

    const handleColumnsChange = useCallback(
        (value: number) => {
            const panelCount = form.getValues('panels').length
            const rowCount = form.getValues('panelLayoutRows')
            if (value * rowCount < panelCount) {
                toast.error(`Please reduce the number of panels first`)
                return
            }

            form.setValue('panelLayoutColumns', value)
        },
        [form]
    )
    const handleRowsChange = useCallback(
        (value: number) => {
            const panelCount = form.getValues('panels').length
            const columnCount = form.getValues('panelLayoutColumns')
            console.log('test', panelCount, columnCount, value)

            if (value * columnCount < panelCount) {
                toast.error(`Please reduce the number of panels first`)
                console.log(
                    `Please reduce the number of panels first: ${panelCount} > ${
                        value * columnCount
                    }`
                )
                return
            }

            form.setValue('panelLayoutRows', value)
        },
        [form]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()

            const files = e.dataTransfer.files
            handleFiles(files)
        },
        [handleFiles]
    )

    return (
        <div className="flex flex-col gap-2">
            <FormFieldLabel className="text-xs" fieldLabel="Comic Layout" />

            <input
                multiple
                type="file"
                accept={FILE_ACCEPTED_TYPES.join(',')}
                className="hidden"
                {...form.register('panels')}
                ref={inputRef}
                onChange={handleInputChange}
            />

            <PanelLayoutMaker
                panels={panels}
                columns={form.watch('panelLayoutColumns')}
                rows={form.watch('panelLayoutRows')}
                onColumnsChange={handleColumnsChange}
                onRowsChange={handleRowsChange}
                onButtonClick={() => {
                    inputRef.current?.click()
                }}
                onDrop={handleDrop}
            />
            <FormFieldError
                fieldError={
                    form.formState.errors.panels?.message ||
                    form.formState.errors.panels?.[0]?.message
                }
            />
            <FormFieldDescription
                fieldDescription={
                    'Drag and drop your comic panels here or click to upload.'
                }
            />
        </div>
    )
}
