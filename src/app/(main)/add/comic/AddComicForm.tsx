'use client'

import { FormInputWithLabel } from '@/components/inputs/FormInputWithLabel/FormInputWithLabel'
import { FormSelectWithLabel } from '@/components/inputs/FormSelectWithLabel/FormSelectWithLabel'
import { FormTextareaWithLabel } from '@/components/inputs/FormTextareaWithLabel/FormTextareaWithLabel'
import { fileSchema } from '@/lib/schemas/appLogicSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import Modal from '@/components/ui/Modal/Modal'
import { FormFileInputDNDWithLabel } from '@/components/inputs/FormFileInputDNDWithLabel/FormFileInputDNDWithLabel'
import { comicPanelSplitTypeSchema, contentVisibilitySchema } from '@/db/schema'
import { capitalizeAll } from '@/lib/utils'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import FormFieldBox from '@/components/inputs/FormFieldBox/FormFieldBox'
import OptionsComicForm from '@/app/(main)/add/comic/OptionsComicForm'
import FormTagInput from '@/components/inputs/FormTagInput/FormTagInput'
import SelectComicSeries from '@/app/(main)/add/comic/SelectComicSeries'
import FormComboboxWithLabel from '@/components/inputs/FormComboboxWithLabel/FormComboboxWithLabel'
import SelectComicCollection from '@/app/(main)/add/comic/SelectComicCollection'

const AddComicSchema = z.object({
    title: z.string(),
    genres: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
    panelCount: z.number(),
    tags: z.array(z.string()),
    seriesId: z.string().optional().nullable(),
    collectionId: z.string().optional().nullable(),
    visibility: contentVisibilitySchema,
    panels: z.array(
        z.object({
            image: fileSchema,
            order: z.number(),
        })
    ),
    language: z.string(),
    panelSplitType: comicPanelSplitTypeSchema,
    disableComments: z.boolean().optional(),
    drawOver: z.boolean().optional(),
})

type TAddComicForm = z.infer<typeof AddComicSchema>

export default function AddComicForm() {
    const methods = useForm<TAddComicForm>({
        defaultValues: {
            title: '',
            genres: [],
            description: '',
            tags: [],
            panels: [],
            visibility: 'public',
        },
        shouldFocusError: true,
        resolver: zodResolver(AddComicSchema),
    })

    const { handleSubmit } = methods

    const onSubmit = useCallback((data: TAddComicForm) => {
        console.log(data)
    }, [])

    const panelCount = methods.watch('panelCount')
    const panelSplitType = methods.watch('panelSplitType')

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="form max-w-lg ">
                <FormInputWithLabel<TAddComicForm>
                    fieldLabel="Title"
                    nameInSchema="title"
                    wrapperClassName="w-full"
                    inputClassName="w-full"
                />

                <FormComboboxWithLabel<TAddComicForm>
                    fieldLabel="Genres"
                    nameInSchema="genres"
                    options={[
                        { value: 'action', label: 'Action' },
                        { value: 'adventure', label: 'Adventure' },
                        { value: 'comedy', label: 'Comedy' },
                        { value: 'drama', label: 'Drama' },
                        { value: 'fantasy', label: 'Fantasy' },
                    ]}
                    multiple={true}
                    placeholder="Select genres"
                />

                {/* <FormSelectWithLabel<TAddComicForm>
                    fieldLabel="Genre"
                    nameInSchema="genre"
                    options={[
                        { value: 'fantasy', label: 'Fantasy' },
                        { value: 'sci-fi', label: 'Sci-Fi' },
                        { value: 'horror', label: 'Horror' },
                    ]}
                    wrapperClassName="w-full"
                    selectClassName="w-full"
                /> */}
                <div className="flex flex-col sm:flex-row  gap-4 w-full ">
                    <FormSelectWithLabel<TAddComicForm>
                        fieldLabel="Language"
                        nameInSchema="language"
                        options={[
                            { value: 'english', label: 'English' },
                            { value: 'spanish', label: 'Spanish' },
                            { value: 'french', label: 'French' },
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
                </div>

                <FormFileInputDNDWithLabel
                    maxFileCount={panelCount}
                    nameInSchema={'panels'}
                    fieldLabel="Panels"
                    fieldDescription="Add your comic panels here. You can drag and drop files or click to select."
                />

                <fieldset className={`fieldset `}>
                    <FormFieldLabel fieldLabel="Split Panels" />
                    <div className="tabs tabs-box ">
                        {comicPanelSplitTypeSchema.options.map((option) => (
                            <input
                                key={option}
                                type="radio"
                                name="panelSplitType"
                                className="tab"
                                aria-label={capitalizeAll(option)}
                                checked={panelSplitType === option}
                                onChange={() =>
                                    methods.setValue('panelSplitType', option)
                                }
                            />
                        ))}
                    </div>
                </fieldset>

                {/* <ComicSplitter /> */}

                <FormTextareaWithLabel<TAddComicForm>
                    fieldLabel="Description"
                    nameInSchema="description"
                    wrapperClassName="w-full"
                    textareaClassName="w-full resize-auto"
                />

                <FormTagInput fieldLabel="Tags" nameInSchema="tags" />

                <SelectComicSeries
                    series={[
                        {
                            id: '1',
                            name: 'My First Series',
                            thumbnail:
                                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My first series',
                            slug: 'my-first-series',
                            totalComics: 1,
                            updatetAt: '2023-10-01T00:00:00.000Z',
                            userId: '1',
                        },
                        {
                            id: '2',
                            name: 'My Second Series',
                            thumbnail:
                                'https://images.unsplash.com/photo-1746311460525-31a29b35f4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My second series',
                            slug: 'my-second-series',
                            totalComics: 1,
                            updatetAt: '2023-10-01T00:00:00.000Z',
                            userId: '1',
                        },
                        {
                            id: '3',
                            name: 'My Third Series',
                            thumbnail:
                                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My third series',
                            slug: 'my-third-series',
                            totalComics: 1,
                            updatetAt: '2023-10-01T00:00:00.000Z',
                            userId: '1',
                        },

                        {
                            id: '4',
                            name: 'My Fourth Series',
                            thumbnail:
                                'https://images.unsplash.com/photo-1746311460525-31a29b35f4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My fourth series',
                            slug: 'my-fourth-series',
                            totalComics: 1,
                            updatetAt: '2023-10-01T00:00:00.000Z',
                            userId: '1',
                        },

                        {
                            id: '5',
                            name: 'My Fifth Series',
                            thumbnail:
                                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My fifth series',
                            slug: 'my-fifth-series',
                            totalComics: 1,
                            updatetAt: '2023-10-01T00:00:00.000Z',
                            userId: '1',
                        },
                    ]}
                    fieldLabel="Add to Series"
                    nameInSchema="seriesId"
                    wrapperClassName="w-full"
                    fieldDescription="Select a series to add this comic to. If you don't have a series, you can create one."
                />

                <SelectComicCollection
                    collections={[
                        {
                            id: '1',
                            name: 'My First Collection',
                            thumbnail:
                                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My first collection',
                            slug: 'my-first-collection',
                            seriesId: '1',
                            updatedAt: '2023-10-01T00:00:00.000Z',

                            userId: '1',
                        },
                        {
                            id: '2',
                            name: 'My Second Collection',
                            thumbnail:
                                'https://images.unsplash.com/photo-1746311460525-31a29b35f4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My second collection',
                            slug: 'my-second-collection',
                            seriesId: '1',
                            updatedAt: '2023-10-01T00:00:00.000Z',

                            userId: '1',
                        },

                        {
                            id: '3',
                            name: 'My Third Collection',
                            thumbnail:
                                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My third collection',
                            slug: 'my-third-collection',
                            seriesId: '1',
                            updatedAt: '2023-10-01T00:00:00.000Z',

                            userId: '1',
                        },

                        {
                            id: '4',
                            name: 'My Fourth Collection',
                            thumbnail:
                                'https://images.unsplash.com/photo-1746311460525-31a29b35f4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My fourth collection',
                            slug: 'my-fourth-collection',
                            seriesId: '1',
                            updatedAt: '2023-10-01T00:00:00.000Z',

                            userId: '1',
                        },

                        {
                            id: '5',
                            name: 'My Fifth Collection',
                            thumbnail:
                                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjA3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400',
                            createdAt: '2023-10-01T00:00:00.000Z',
                            description: 'My fifth collection',
                            slug: 'my-fifth-collection',
                            seriesId: '1',
                            updatedAt: '2023-10-01T00:00:00.000Z',

                            userId: '1',
                        },
                    ]}
                    fieldLabel="Add to Collection"
                    nameInSchema="collectionId"
                    wrapperClassName="w-full"
                    fieldDescription="Select a collection to add this comic to. If you don't have a collection, you can create one."
                />

                <FormFieldBox<TAddComicForm>
                    options={contentVisibilitySchema.options}
                    fieldLabel="Visibility"
                    inputType="radio"
                    nameInSchema="visibility"
                />

                <OptionsComicForm<TAddComicForm>
                    fieldLabel="Options"
                    options={[
                        {
                            label: 'Disable Comments',
                            nameInSchema: 'disableComments',
                        },
                        { label: 'Draw Over', nameInSchema: 'drawOver' },
                    ]}
                />

                <div className="flex justify-between items-center mt-8 ">
                    <Modal
                        modalId="reset-comic-form"
                        modalTitle="Reset Form"
                        onConfirm={() => {
                            methods.reset()
                        }}
                        trigger={
                            <button
                                type="button"
                                className="btn btn-error mr-2 btn-outline"
                            >
                                Reset
                            </button>
                        }
                        submitLabel="Reset"
                        cancelLabel="Cancel"
                    >
                        <div className="py-4">
                            Are you sure you want to reset the form?
                        </div>
                    </Modal>

                    <button type="submit" className="btn btn-primary btn-wide">
                        Submit
                    </button>
                </div>
            </form>
        </FormProvider>
    )
}
