import {
    TAddComicForm,
    TAddComicPanel,
} from '@/app/(main)/add/comic/AddComicForm'
import FormFieldDescription from '@/components/inputs/FormFieldDescription/FormFieldDescription'
import FormFieldError from '@/components/inputs/FormFieldError/FormFieldError'
import FormFieldLabel from '@/components/inputs/FormFieldLabel/FormFieldLabel'
import SelectButton from '@/components/inputs/SelectButton/SelectButton'
import { PanelLayoutMaker } from '@/components/ui/PanelLayoutMaker/PanelLayoutMaker'

import {
    FILE_ACCEPTED_TYPES,
    MAX_BORDER_WIDTH,
    MAX_GAP_SIZE,
    MAX_PANEL_COLUMNS,
} from '@/appConfig'
import { bestColumnsNumber } from '@/lib/app'
import { fileSchema } from '@/lib/schemas/appLogicSchema'
import {
    BetweenHorizontalStartIcon,
    BetweenVerticalEndIcon,
    BookOpenText,
    Columns2Icon,
    EyeIcon,
    ImagesIcon,
    PaintRollerIcon,
    PlusIcon,
    TrashIcon,
} from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import BorderIcon from '@/components/icons/BorderIcon'
import CheckboxButton from '@/components/inputs/CheckboxButton/CheckboxButton'
import RoundedIcon from '@/components/icons/RoundedIcon'
import ColorInputButton from '@/components/inputs/ColorInputButton/ColorInputButton'
import InputButton from '@/components/inputs/TextInputButton/TextInputButton'
import { TReadingMode } from '@/types'
import { readingModeSchema } from '@/db/schema'

export default function AddComicPanelLayoutMaker() {
    const form = useFormContext<TAddComicForm>()

    const inputRef = React.useRef<HTMLInputElement>(null)
    const [panels, setPanels] = React.useState<TAddComicPanel[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const columns = form.watch('panelLayoutColumns')
    const borderWidth = form.watch('panelLayoutBorderWidth')
    const gapRow = form.watch('panelLayoutGapRow')
    const gapCol = form.watch('panelLayoutGapCol')
    const rounded = form.watch('panelLayoutRounded')
    const backgroundColor = form.watch('panelLayoutBackgroundColor')
    const readingMode = form.watch('panelLayoutReadingMode')

    console.log('backgroundColor', backgroundColor)

    const handleFiles = useCallback(
        async (files: FileList | File[] | null) => {
            if (!files) return

            const validFiles: File[] = []
            Array.from(files).forEach((file) => {
                const result = fileSchema.safeParse(file)
                if (!result.success) {
                    console.log('error', result.error.issues[0].message)
                    toast.error(
                        `${file.name}: ${result.error.issues[0].message}` ||
                            `File ${file.name} is invalid`
                    )
                    return
                }
                validFiles.push(file)
            })

            const panelsWithPreviews = await Promise.all(
                validFiles.map((file, index) => {
                    return new Promise<TAddComicPanel>((resolve) => {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                            resolve({
                                id: crypto.randomUUID(),
                                file,
                                previewUrl: event.target?.result as string,
                                order: panels.length + index,
                            })
                        }
                        reader.readAsDataURL(file)
                    })
                })
            )

            setPanels((prev) => {
                const updated = [...prev, ...panelsWithPreviews]
                form.setValue('panels', updated)
                return updated
            })

            if (!columns || columns < 1) {
                form.setValue(
                    'panelLayoutColumns',
                    bestColumnsNumber(panels.length + panelsWithPreviews.length)
                )
            }
        },
        [form, panels, columns]
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
                if (inputRef.current) {
                    inputRef.current.value = ''
                }
                return updated
            })
        },
        [form, inputRef]
    )

    const handleColumnsChange = useCallback(
        (value: number) => {
            form.setValue('panelLayoutColumns', value)
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
                ref={inputRef}
                onChange={handleInputChange}
            />
            <div className="border border-b-2 rounded-field border-base-300 ">
                {panels.length > 0 ? (
                    <>
                        <div className="border-b border-base-300 w-full flex items-center gap-4 justify-between p-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <SelectButton
                                    tooltip="Columns"
                                    value={columns}
                                    onChange={(col) =>
                                        handleColumnsChange(
                                            typeof col === 'number'
                                                ? col
                                                : parseInt(col, 10)
                                        )
                                    }
                                    className="btn-sm"
                                    labelClassName="grow"
                                    label={<Columns2Icon className="w-4 h-4" />}
                                    options={Array.from(
                                        { length: MAX_PANEL_COLUMNS },
                                        (_, i) => ({
                                            value: i + 1,
                                            label: `${i + 1}`,
                                        })
                                    )}
                                />

                                <InputButton
                                    tooltip="Border Width"
                                    type="number"
                                    label={<BorderIcon className="w-4 h-4" />}
                                    aria-label="Panel Border Width"
                                    min={0}
                                    max={MAX_BORDER_WIDTH}
                                    className="max-w-12"
                                    {...form.register('panelLayoutBorderWidth')}
                                    onChange={(e) => {
                                        const value = parseInt(
                                            e.target.value,
                                            10
                                        )
                                        if (value < 0) {
                                            e.target.value = String(0)
                                        } else if (value > MAX_BORDER_WIDTH) {
                                            e.target.value =
                                                String(MAX_BORDER_WIDTH)
                                        }

                                        form.register(
                                            'panelLayoutBorderWidth'
                                        ).onChange(e)
                                    }}
                                />

                                <InputButton
                                    tooltip="Column Gap"
                                    type="number"
                                    label={
                                        <BetweenVerticalEndIcon className="w-4 h-4" />
                                    }
                                    aria-label="Panel Column Gap"
                                    min={0}
                                    max={MAX_GAP_SIZE}
                                    className="max-w-12"
                                    {...form.register('panelLayoutGapCol')}
                                />

                                <InputButton
                                    tooltip="Row Gap"
                                    type="number"
                                    className="max-w-12"
                                    label={
                                        <BetweenHorizontalStartIcon className="w-4 h-4" />
                                    }
                                    aria-label="Panel Row Gap"
                                    min={0}
                                    max={MAX_GAP_SIZE}
                                    {...form.register('panelLayoutGapRow')}
                                />

                                <CheckboxButton
                                    tooltip="Rounded Corners"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            form.setValue(
                                                'panelLayoutRounded',
                                                true
                                            )
                                        } else {
                                            form.setValue(
                                                'panelLayoutRounded',
                                                false
                                            )
                                        }
                                    }}
                                    checked={rounded}
                                    className=""
                                    label={<RoundedIcon className="w-4 h-4" />}
                                    name="panelLayoutRounded"
                                    aria-label="Rounded Corners"
                                />

                                <ColorInputButton
                                    tooltip="Background Color"
                                    value={backgroundColor}
                                    onChange={(e) => {
                                        form.setValue(
                                            'panelLayoutBackgroundColor',
                                            e.target.value
                                        )
                                    }}
                                    className="btn-sm"
                                    label={
                                        <PaintRollerIcon className="w-4 h-4" />
                                    }
                                    name="panelLayoutBackgroundColor"
                                    aria-label="Panel Background Color"
                                />

                                <SelectButton
                                    tooltip="Reading Mode"
                                    value={readingMode}
                                    onChange={(val) =>
                                        form.setValue(
                                            'panelLayoutReadingMode',
                                            val as TReadingMode
                                        )
                                    }
                                    className="btn-sm"
                                    label={<BookOpenText className="w-4 h-4" />}
                                    options={readingModeSchema.options.map(
                                        (option) => ({
                                            value: option,
                                            label:
                                                option === 'leftToRight'
                                                    ? 'Left to Right'
                                                    : option === 'rightToLeft'
                                                    ? 'Right to Left'
                                                    : 'Other',
                                        })
                                    )}
                                />
                            </div>
                        </div>

                        <PanelLayoutMaker<TAddComicPanel>
                            getItemId={(panel) => panel.id}
                            items={panels}
                            setItems={setPanels}
                            columns={columns}
                            borderWidth={borderWidth}
                            gapRow={gapRow}
                            gapCol={gapCol}
                            readingMode={readingMode}
                            rounded={rounded}
                            backgroundColor={backgroundColor}
                            displayItem={(panel) => (
                                <Image
                                    src={panel.previewUrl}
                                    alt={`Panel ${panel.order + 1}`}
                                    className="w-full h-auto aspect-square object-cover select-none"
                                    width={200}
                                    height={200}
                                    draggable={false}
                                />
                            )}
                            removable={true}
                            onRemove={handlePanelRemove}
                            handle={true}
                            isDisabled={() => panels.length < 2}
                            onNewPanelButtonClick={() => {
                                inputRef.current?.click()
                            }}
                        />

                        <div className="flex items-center p-2 border-t border-base-300">
                            <div className="flex items-center justify-between w-full">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-soft hover:btn-error "
                                    onClick={() => {
                                        setPanels([])
                                        form.setValue('panels', [])
                                        if (inputRef.current) {
                                            inputRef.current.value = ''
                                        }
                                    }}
                                >
                                    Reset
                                    <TrashIcon size={16} />
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm "
                                    >
                                        Preview
                                        <EyeIcon size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary "
                                        onClick={() => {
                                            inputRef.current?.click()
                                        }}
                                    >
                                        Add Panels
                                        <PlusIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        className={`flex flex-col items-center gap-2 p-10 ${
                            isDragging && 'bg-base-200'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.dataTransfer.dropEffect = 'copy'
                            setIsDragging(true)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.dataTransfer.dropEffect = 'none'
                            setIsDragging(false)
                        }}
                        onDrop={handleDrop}
                    >
                        {isDragging ? (
                            <p>Drop Here</p>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-primary "
                                onClick={() => {
                                    inputRef.current?.click()
                                }}
                            >
                                Add Images
                                <ImagesIcon size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>
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
