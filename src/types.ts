import {
    InputHTMLAttributes,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react'

export type TActionResponse = {
    isError?: boolean
    message?: string
}

export type TActionResponseWithPayload<T> = TActionResponse & {
    data?: T
}

export type TFormField<S> = {
    fieldLabel: string
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
        suggestions: SuggestionSource
    }

export type TFormTagInputField<S> = TFormField<S>

export type TFormComboBoxField<S> = TFormField<S> & {
    options: TInputOption[]
    multiple?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export type SuggestionSource = string[] | ((query: string) => Promise<string[]>)
