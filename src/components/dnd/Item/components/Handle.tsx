import Action, { ActionProps } from '@/components/dnd/Item/components/Action'
import { GripVerticalIcon } from 'lucide-react'
import React, { forwardRef } from 'react'

export const Handle = forwardRef<HTMLButtonElement, ActionProps>(
    (props, ref) => {
        return (
            <Action
                ref={ref}
                cursor="grab"
                data-cypress="draggable-handle"
                {...props}
            >
                <GripVerticalIcon />
            </Action>
        )
    }
)

Handle.displayName = 'Handle'
