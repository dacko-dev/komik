import Action, { ActionProps } from '@/components/ui/PanelCreator/Panel/Action'
import { GripVerticalIcon } from 'lucide-react'

export default function Handle(props: ActionProps) {
    return (
        <Action cursor="grab" data-cypress="draggable-handle" {...props}>
            <GripVerticalIcon />
        </Action>
    )
}
