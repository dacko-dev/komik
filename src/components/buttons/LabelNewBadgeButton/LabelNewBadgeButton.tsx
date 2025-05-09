import { PlusIcon } from 'lucide-react'
import React from 'react'

export default function LabelNewBadgeButton({
    label = 'New',
    ...props
}: {
    label?: string
} & React.HTMLProps<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`btn btn-xs btn-secondary h-5 ${props.className}`}
            type="button"
        >
            {label}
            <PlusIcon className="h-4 w-4" />
        </button>
    )
}
