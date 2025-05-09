import FormComboboxWithLabel from '@/components/inputs/FormComboboxWithLabel/FormComboboxWithLabel'
import { FormFileInputDNDWithLabel } from '@/components/inputs/FormFileInputDNDWithLabel/FormFileInputDNDWithLabel'
import { FormInputWithLabel } from '@/components/inputs/FormInputWithLabel/FormInputWithLabel'
import { FormTextareaWithLabel } from '@/components/inputs/FormTextareaWithLabel/FormTextareaWithLabel'
import { FILE_MAX_SIZE } from '@/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const AddSeriesSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    genres: z.array(z.string()).optional(),
})

type TAddSeriesSchema = z.infer<typeof AddSeriesSchema>

export default function AddSeriesForm() {
    const form = useForm<TAddSeriesSchema>({
        resolver: zodResolver(AddSeriesSchema),
        defaultValues: {
            name: '',
            description: '',
            thumbnail: '',
            genres: [],
        },
    })

    return (
        <form
            className="form"
            onSubmit={form.handleSubmit((data) => console.log(data))}
        >
            <FormInputWithLabel<TAddSeriesSchema>
                fieldLabel="Name"
                nameInSchema={'name'}
                inputClassName="w-full"
            />

            <FormComboboxWithLabel<TAddSeriesSchema>
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

            <FormTextareaWithLabel<TAddSeriesSchema>
                fieldLabel="Description"
                nameInSchema={'description'}
                textareaClassName="w-full"
            />

            <FormFileInputDNDWithLabel<TAddSeriesSchema>
                fieldLabel="Thumbnail"
                nameInSchema={'thumbnail'}
                maxFileSize={FILE_MAX_SIZE}
                maxFileCount={1}
            />

            {/* <div className="flex justify-between gap-2 mt-4">
                <button type="button" className="btn btn-secondary btn-outline">
                    Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div> */}
        </form>
    )
}
