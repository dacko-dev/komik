import { COMIC_SPLIT_TYPES } from '@/constants'
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
} & SelectHTMLAttributes<HTMLSelectElement>

export type TFormTextAreaField<S> = TFormField<S> & {
    textareaClassName?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export type TCOMIC_SPLIT_TYPES = (typeof COMIC_SPLIT_TYPES)[number]
