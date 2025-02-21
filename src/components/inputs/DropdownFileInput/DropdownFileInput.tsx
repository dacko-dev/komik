import { FILE_ACCEPTED_TYPES } from '@/constants'
import { useRef } from 'react'

type DropdownFileInputProps = {
    onChange: (files: File[]) => void
} & React.HTMLProps<HTMLInputElement>

export default function DropdownFileInput({
    onChange,
    ...props
}: DropdownFileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <label
            htmlFor={props.id || 'file-input'}
            onClick={(e) => {
                e.preventDefault()
                inputRef.current?.click()
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    inputRef.current?.click()
                }
            }}
            className="relative"
        >
            <input
                ref={inputRef}
                type="file"
                className="file-input file-input-primary absolute inset-0 w-full h-full opacity-0"
                onChange={(e) => {
                    if (e.target.files) {
                        onChange(Array.from(e.target.files))
                    }
                }}
                {...props}
                accept={props.accept || FILE_ACCEPTED_TYPES.join(',')}
                id={props.id || 'file-input'}
            />
            <button className="btn">Choose File</button>
        </label>
    )
}
