import Action, {
    ActionProps,
} from '@/components/ui/PanelLayoutMaker/Panel/Action'
import { GripVerticalIcon } from 'lucide-react'

export default function Handle(props: ActionProps) {
    return (
        <Action cursor="grab" data-cypress="draggable-handle" {...props}>
            <GripVerticalIcon size={26} />
        </Action>
    )
}
