'use client'

import LabelNewBadgeButton from '@/components/buttons/LabelNewBadgeButton/LabelNewBadgeButton'
import AddCollectionForm from '@/components/forms/AddCollectionForm/AddCollectionForm'
import Modal from '@/components/ui/Modal/Modal'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import { collectionsSelectSchema } from '@/db/schema'
import { TFormField } from '@/types'
import { Controller, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import ScrollableCarousel from '@/components/ui/ScrollableCarousel/ScrollableCarousel'
import CardSelectInput from '@/components/inputs/CardSelectInput/CardSelectInput'

/*
 * SelectComicCollection component
 * This component is used to select a comic collections from a list of collections.
 * It uses react-hook-form Controller to manage the form input state.
 *
 * @param {TFormField<S>} - The form field properties.
 * @param {collections} - The list of comic collections to select from.
 * @returns {JSX.Element} - The rendered component.
 */

export default function SelectComicCollection<S>({
    collections,
    fieldLabel,
    fieldDescription,
    nameInSchema,
    labelClassName,
    wrapperClassName,
}: TFormField<S> & {
    collections: z.infer<typeof collectionsSelectSchema>[]
}) {
    const form = useFormContext()

    return (
        <Controller
            control={form.control}
            name={nameInSchema}
            render={({ field, fieldState }) => (
                <fieldset className={`fieldset ${wrapperClassName}`}>
                    <FormFieldLabel
                        className={labelClassName}
                        fieldLabel={
                            <p className="flex items-center gap-2">
                                {fieldLabel}
                                <Modal
                                    usePortal={true}
                                    modalId="add-comic-collections"
                                    modalTitle="Add Collection"
                                    modalDescription="Create a new collections to get started"
                                    onConfirm={() =>
                                        console.log('Create Collection')
                                    }
                                    trigger={<LabelNewBadgeButton />}
                                    submitLabel="Create"
                                    cancelLabel="Cancel"
                                >
                                    <AddCollectionForm />
                                </Modal>
                            </p>
                        }
                    />

                    {collections.length > 0 ? (
                        <ScrollableCarousel>
                            {collections.map((s) => (
                                <CardSelectInput
                                    key={s.id}
                                    id={`${nameInSchema}-${s.id}`}
                                    label={s.name}
                                    thumbnail={s.thumbnail}
                                    value={s.id}
                                    type="radio"
                                    checked={field.value === s.id}
                                    onChange={() => field.onChange(s.id)}
                                    onClick={() => {
                                        if (field.value === s.id) {
                                            field.onChange('')
                                        }
                                    }}
                                />
                            ))}
                        </ScrollableCarousel>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center input h-auto border-2 border-dotted p-4">
                            <span className="text-sm">
                                No collections found
                            </span>
                        </div>
                    )}

                    <FormFieldDescription fieldDescription={fieldDescription} />
                    <FormFieldError fieldError={fieldState.error?.message} />
                </fieldset>
            )}
        />
    )
}
