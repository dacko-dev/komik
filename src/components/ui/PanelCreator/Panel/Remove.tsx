import Action, { ActionProps } from '@/components/ui/PanelCreator/Panel/Action'
import { XIcon } from 'lucide-react'
import React from 'react'

export default function Remove(props: ActionProps) {
    return (
        <Action cursor="grab" data-cypress="draggable-handle" {...props}>
            <XIcon />
        </Action>
    )
}
