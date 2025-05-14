/* eslint-disable @typescript-eslint/no-unused-vars */
import { TAddComicForm } from '@/app/(main)/add/comic/AddComicForm'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import PanelLayoutMaker from '@/components/ui/PanelLayoutMaker/PanelLayoutMaker'
import { TFormField } from '@/types'
import React from 'react'
import { useFormContext } from 'react-hook-form'

export default function AddComicPanelLayoutMaker<S>({
    fieldLabel,
    fieldDescription,
    labelClassName,
    wrapperClassName,
}: Omit<TFormField<S>, 'nameInSchema'>) {
    const form = useFormContext<TAddComicForm>()

    return (
        <div className="flex flex-col gap-2">
            <FormFieldLabel className="text-xs" fieldLabel="Comic Layout" />

            <PanelLayoutMaker
                columns={form.watch('panelLayoutColumns')}
                rows={form.watch('panelLayoutRows')}
                onColumnsChange={(value) =>
                    form.setValue('panelLayoutColumns', value)
                }
                onRowsChange={(value) =>
                    form.setValue('panelLayoutRows', value)
                }
            />
        </div>
    )
}
