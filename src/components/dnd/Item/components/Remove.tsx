import Action, { ActionProps } from '@/components/dnd/Item/components/Action'
import { XIcon } from 'lucide-react'
import React from 'react'

export default function Remove(props: ActionProps) {
    return (
        <Action
            {...props}
            active={{
                fill: 'rgba(var(--color-error), 1)',
                background: 'rgba(var(--color-error-content), 1)',
            }}
        >
            <XIcon />
        </Action>
    )
}
