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
            className={`btn btn-xs btn-secondary rounded-[var(--radius-field)] h-5 ${props.className}`}
            type="button"
        >
            {label}
            <PlusIcon className="h-3 w-3" />
        </button>
    )
}
