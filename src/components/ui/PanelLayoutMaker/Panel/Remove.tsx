import Action, {
    ActionProps,
} from '@/components/ui/PanelLayoutMaker/Panel/Action'
import { XIcon } from 'lucide-react'
import React from 'react'

export default function Remove(props: ActionProps) {
    return (
        <Action {...props}>
            <XIcon strokeWidth={4} size={20} />
        </Action>
    )
}
