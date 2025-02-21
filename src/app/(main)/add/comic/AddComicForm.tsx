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
                className="flex  justify-center items-center flex-col"
            >
                <FormInputWithLabel<TAddComicForm>
                    fieldLabel="Title"
                    nameInSchema="title"
                />

                <FormSelectWithLabel<TAddComicForm>
                    fieldLabel="Genre"
                    nameInSchema="genre"
                    options={[
                        { value: 'fantasy', label: 'Fantasy' },
                        { value: 'sci-fi', label: 'Sci-Fi' },
                        { value: 'horror', label: 'Horror' },
                    ]}
                />
                <ComicSplitter />

                <FormSelectWithLabel<TAddComicForm>
                    fieldLabel="Panel Count"
                    nameInSchema="panelCount"
                    options={[
                        { value: '1', label: '1' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                        { value: '4', label: '4' },
                    ]}
                />

                <FormTextareaWithLabel<TAddComicForm>
                    fieldLabel="Description"
                    nameInSchema="description"
                    type=""
                />
            </form>
        </FormProvider>
    )
}
