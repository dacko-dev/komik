import {
    comicLayoutSchema,
    comicOptionsConfig,
    genresSelectSchema,
    languagesSelectSchema,
    panelInfoSchema,
    seriesSelectSchema,
    tagsSelectSchema,
} from '@/db/schema'
import {
    InputHTMLAttributes,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react'
import { z } from 'zod'

export type TActionResponse = {
    isError?: boolean
    message?: string
}

export type TActionResponseWithPayload<T> = TActionResponse & {
    data?: T
}

// ------------------- FORM TYPES -------------------

export type TFormField<S> = {
    fieldLabel?: string
    fieldDescription?: string
    labelClassName?: string
    wrapperClassName?: string
    nameInSchema: keyof S & string
}

export type TFormInputField<S> = TFormField<S> & {
    inputClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

export type TInputOption = {
    value: string
    label: string
}

export type TFormSelectField<S> = TFormField<S> & {
    selectClassName?: string
    options: TInputOption[]
} & SelectHTMLAttributes<HTMLSelectElement>

export type TFormTextAreaField<S> = TFormField<S> & {
    textareaClassName?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export type TAutocompleteInputFieldProps = {
    inputProps: React.InputHTMLAttributes<HTMLInputElement>
    datalistProps: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDataListElement>,
        HTMLDataListElement
    >
    suggestions: string[]
    loading: boolean
    wrapperClassName?: string
    onSuggestionClick?: (suggestion: string) => void
}

export type TFormAutocompleteInputField<S> = TFormField<S> &
    Omit<TAutocompleteInputFieldProps, 'loading' | 'suggestions'> & {
        suggestions: TSuggestionSource
    }

export type TFormTagInputField<S> = TFormField<S>

export type TFormComboBoxField<S> = TFormField<S> & {
    options: TInputOption[]
    multiple?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export type TSuggestionSource =
    | string[]
    | ((query: string) => Promise<string[]>)

// ------------------- APP TYPES -------------------

export type TGenre = z.infer<typeof genresSelectSchema>

export type TLanguage = z.infer<typeof languagesSelectSchema>

export type TTag = z.infer<typeof tagsSelectSchema>

export type TSeries = z.infer<typeof seriesSelectSchema>

type TOptionConfig = typeof comicOptionsConfig

export type InferOptionValue<T> = T extends { type: 'boolean' }
    ? boolean
    : T extends { type: 'string' }
    ? string
    : T extends { type: 'number' }
    ? number
    : T extends { type: 'date' }
    ? Date
    : T extends { type: 'object' }
    ? object
    : T extends { type: 'array' }
    ? unknown[]
    : T extends { type: 'null' }
    ? null
    : T extends { type: 'undefined' }
    ? undefined
    : T extends { type: 'any' }
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : unknown

export type TComicOptions = {
    [K in keyof TOptionConfig]: InferOptionValue<TOptionConfig[K]>
}

export type TPanelInfo = z.infer<typeof panelInfoSchema>

export type TComicLayout = z.infer<typeof comicLayoutSchema>
