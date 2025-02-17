import { InputHTMLAttributes } from 'react'

export type TActionResponse = {
    isError?: boolean
    message?: string
}

export type TActionResponseWithPayload<T> = TActionResponse & {
    data?: T
}

type TFormField<S> = {
    fieldLabel: string
    fieldDescription?: string
    labelClassName?: string
    wrapperClassName?: string
    nameInSchema: keyof S & string
}

export type TFormInputField<S> = TFormField<S> & {
    inputClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

type TSelectOption = {
    value: string
    label: string
}

export type TFormSelectField<S> = TFormField<S> & {
    selectClassName?: string
    options: TSelectOption[]
} & InputHTMLAttributes<HTMLSelectElement>

export type TFormTextAreaField<S> = TFormField<S> & {
    textareaClassName?: string
} & InputHTMLAttributes<HTMLTextAreaElement>
