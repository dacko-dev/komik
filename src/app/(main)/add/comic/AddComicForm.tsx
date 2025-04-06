'use client'

import ComicSplitter from '@/components/inputs/ComicSplitter/ComicSplitter'
import { FormInputWithLabel } from '@/components/inputs/FormInputWithLabel/FormInputWithLabel'
import { FormSelectWithLabel } from '@/components/inputs/FormSelectWithLabel/FormSelectWithLabel'
import { FormTextareaWithLabel } from '@/components/inputs/FormTextareaWithLabel/FormTextareaWithLabel'
import { fileSchema } from '@/lib/schemas/appLogicSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { TCOMIC_SPLIT_TYPES } from '@/types'
import { FileInputDNDWithLabel } from '@/components/inputs/FileInputDNDWithLabel/FileInputDNDWithLabel'

const AddComicSchema = z.object({
    title: z.string(),
    genre: z.string(),
    description: z.string().optional().nullable(),
    panelCount: z.number(),
    tags: z.array(z.string()),
    seriesId: z.string().optional().nullable(),
    collectionId: z.string().optional().nullable(),
    panels: z.array(
        z.object({
            image: fileSchema,
            order: z.number(),
        })
    ),
})

type TAddComicForm = z.infer<typeof AddComicSchema>

export default function AddComicForm() {
    const [comicSplitType, setComicSplitType] =
        React.useState<TCOMIC_SPLIT_TYPES>('Split')

    const methods = useForm<TAddComicForm>({
        defaultValues: {
            title: '',
            genre: '',
            description: '',
            tags: [],
            panels: [],
        },
        shouldFocusError: true,
        resolver: zodResolver(AddComicSchema),
    })
    const { handleSubmit } = methods

    const onSubmit = useCallback((data: TAddComicForm) => {
        console.log(data)
    }, [])

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex justify-center items-stretch flex-col w-full max-w-lg"
            >
                <FormInputWithLabel<TAddComicForm>
                    fieldLabel="Title"
                    nameInSchema="title"
                    wrapperClassName="w-full"
                    inputClassName="w-full"
                />

                <FormSelectWithLabel<TAddComicForm>
                    fieldLabel="Genre"
                    nameInSchema="genre"
                    options={[
                        { value: 'fantasy', label: 'Fantasy' },
                        { value: 'sci-fi', label: 'Sci-Fi' },
                        { value: 'horror', label: 'Horror' },
                    ]}
                    wrapperClassName="w-full"
                    selectClassName="w-full"
                />

                <FormSelectWithLabel<TAddComicForm>
                    fieldLabel="Panel Count"
                    nameInSchema="panelCount"
                    options={[
                        { value: '1', label: '1' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                        { value: '4', label: '4' },
                    ]}
                    wrapperClassName="w-full"
                    selectClassName="w-full"
                />
                <FileInputDNDWithLabel
                    nameInSchema={'panels'}
                    fieldLabel="Panels"
                    fieldDescription="Add your comic panels here. You can drag and drop files or click to select."
                />

                <div className="tabs tabs-box ">
                    <input
                        type="radio"
                        name="Split"
                        className="tab"
                        aria-label="Split"
                        checked={comicSplitType === 'Split'}
                        onChange={() => setComicSplitType('Split')}
                    />
                    <input
                        type="radio"
                        name="Whole"
                        className="tab"
                        aria-label="Whole"
                        checked={comicSplitType === 'Whole'}
                        onChange={() => setComicSplitType('Whole')}
                    />
                </div>
                {/* <ComicSplitter /> */}

                <FormTextareaWithLabel<TAddComicForm>
                    fieldLabel="Description"
                    nameInSchema="description"
                    wrapperClassName="w-full"
                    textareaClassName="w-full resize-auto"
                />

                <fieldset className="fieldset bg-base-200 border border-base-300 p-4 rounded-field w-full">
                    <legend className="fieldset-legend">Options</legend>
                    <div className="flex  gap-8">
                        <label className="fieldset-label text-base select-none">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="checkbox"
                            />
                            Private
                        </label>

                        <label className="fieldset-label text-base select-none">
                            <input type="checkbox" className="checkbox" />
                            Disable Comments
                        </label>

                        <label className="fieldset-label text-base select-none">
                            <input type="checkbox" className="checkbox" />
                            Draw Over
                        </label>
                    </div>
                </fieldset>
            </form>
        </FormProvider>
    )
}
