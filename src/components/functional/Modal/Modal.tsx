import React, { MouseEvent } from 'react'

type TriggerWithOnClick = React.ReactElement<{
    onClick: (e: MouseEvent) => void
}>

type ModalProps = {
    modalId: string
    modalTitle: string
    modalDescription?: string
    trigger: TriggerWithOnClick
    onConfirm: () => void
    onCancel?: () => void
    submitLabel?: string
    cancelLabel?: string
    children?: React.ReactNode
}

export default function Modal({
    modalId,
    modalTitle,
    modalDescription,
    trigger,
    submitLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    children,
}: ModalProps) {
    const dialogRef = React.useRef<HTMLDialogElement>(null)

    const closeModal = () => {
        dialogRef.current?.close()
    }

    const enhancedTrigger = React.cloneElement(trigger, {
        onClick: (e: MouseEvent) => {
            // Call the original onClick from the passed trigger
            trigger.props.onClick(e)

            dialogRef.current?.showModal()
        },
    })

    return (
        <>
            {enhancedTrigger}
            <dialog
                ref={dialogRef}
                id={modalId}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{modalTitle}</h3>
                    {modalDescription && (
                        <p className="py-4 text-sm ">{modalDescription}</p>
                    )}

                    {children || (
                        <p className="py-4">
                            Are you sure you want to continue?
                        </p>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            className="btn btn-outline"
                            onClick={() => {
                                if (onCancel) {
                                    onCancel()
                                }
                                closeModal()
                            }}
                        >
                            {cancelLabel || 'Cancel'}
                        </button>
                        <button className="btn btn-primary" onClick={onConfirm}>
                            {submitLabel || 'Confirm'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button aria-label="Close Modal">close</button>
                </form>
            </dialog>
        </>
    )
}
