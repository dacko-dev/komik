'use client'

import { FormInputWithLabel } from '@/components/inputs/FormInputWithLabel/FormInputWithLabel'
import { FormSelect } from '@/components/inputs/FormSelect/FormSelect'
import { FormTextareaWithLabel } from '@/components/inputs/FormTextareaWithLabel/FormTextareaWithLabel'
import { fileSchema } from '@/lib/schemas/appLogicSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import Modal from '@/components/ui/Modal/Modal'
import { comicOptionsConfig, contentVisibilitySchema } from '@/db/schema'
import { stringToZodType } from '@/lib/utils'
import FormFieldBox from '@/components/inputs/FormFieldBox/FormFieldBox'
import OptionsComicForm from '@/app/(main)/add/comic/OptionsComicForm'
import FormTagInput from '@/components/inputs/FormTagInput/FormTagInput'
import SelectComicSeries from '@/app/(main)/add/comic/SelectComicSeries'
import FormComboboxWithLabel from '@/components/inputs/FormComboboxWithLabel/FormComboboxWithLabel'
import SelectComicCollection from '@/app/(main)/add/comic/SelectComicCollection'
import { TGenre, TLanguage, TSeries } from '@/types'
import AddComicPanelLayoutMaker from '@/app/(main)/add/comic/AddComicPanelLayoutMaker'
import { MAX_PANEL_COUNT, MIN_PANEL_COUNT } from '@/constants'

const AddComicPanelSchema = z.object({
    id: z.string(),
    file: fileSchema,
    previewUrl: z.string(),
    order: z.number(),
})

export type TAddComicPanel = z.infer<typeof AddComicPanelSchema>

const AddComicSchema = z.object({
    title: z.string(),
    genres: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
    tags: z.array(z.string()),
    seriesId: z.string().optional().nullable(),
    collectionId: z.string().optional().nullable(),
    visibility: contentVisibilitySchema,
    panelLayoutColumns: z.number(),
    panelLayoutRows: z.number(),
    panels: z
        .array(AddComicPanelSchema)
        .min(MIN_PANEL_COUNT, `At least ${MIN_PANEL_COUNT} panel is required`)
        .max(MAX_PANEL_COUNT, `Maximum ${MAX_PANEL_COUNT} panels are allowed`),
    language: z.string(),

    // comicOptionsConfig
    options: z.object(
        Object.fromEntries(
            Object.entries(comicOptionsConfig).map(([, config]) => {
                return [config.name, stringToZodType(config.type).optional()]
            })
        )
    ),
})

// const withDefaults = {
//     ...parsed,
//     options: {
//         ...Object.fromEntries(
//             Object.entries(comicOptionsConfig).map(([k, v]) => [k, v.default])
//         ),
//         ...parsed.options,
//     },
// }

export type TAddComicForm = z.infer<typeof AddComicSchema>

export default function AddComicForm({
    genres = [],
    languages = [],
    userSeries = [],
}: {
    genres: TGenre[]
    languages: TLanguage[]
    userSeries: TSeries[]
}) {
    const methods = useForm<TAddComicForm>({
        defaultValues: {
            title: '',
            genres: [],
            description: '',
            tags: [],
            panels: [],
            visibility: 'public',
            panelLayoutColumns: 1,
            panelLayoutRows: 1,
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
                    options={genres.map((genre) => ({
                        value: genre.id,
                        label: genre.name,
                    }))}
                    multiple={true}
                    placeholder="Select genres"
                />

                <FormSelect<TAddComicForm>
                    fieldLabel="Language"
                    nameInSchema="language"
                    options={languages.map((language) => ({
                        value: language.id,
                        label: language.name,
                    }))}
                    wrapperClassName="w-full"
                    selectClassName="w-full"
                />

                {/* TODO: create grid layout DND file input */}
                {/* <FormFileInputDNDWithLabel
                    maxFileCount={MAX_PANEL_COUNT}
                    nameInSchema={'panels'}
                    fieldLabel="Panels"
                    fieldDescription="Add your comic panels here. You can drag and drop files or click to select."
                /> */}

                <AddComicPanelLayoutMaker />

                <FormTextareaWithLabel<TAddComicForm>
                    fieldLabel="Description"
                    nameInSchema="description"
                    wrapperClassName="w-full"
                    textareaClassName="w-full resize-auto"
                />

                <FormTagInput fieldLabel="Tags" nameInSchema="tags" />

                <SelectComicSeries
                    series={userSeries}
                    fieldLabel="Add to Series"
                    nameInSchema="seriesId"
                    wrapperClassName="w-full"
                    fieldDescription="Select a series to add this comic to. If you don't have a series, you can create one."
                />

                {/* TODO: fetch collections based on selected series */}
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
                            name: 'My Second Collection test',
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
                    nameInSchema="options"
                    fieldLabel="Options"
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
