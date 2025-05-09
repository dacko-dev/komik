import React, { MouseEvent } from 'react'
import ReactDOM from 'react-dom'

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
    usePortal?: boolean
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
    usePortal = false,
    children,
}: ModalProps) {
    const dialogRef = React.useRef<HTMLDialogElement>(null)

    const closeModal = () => {
        dialogRef.current?.close()
    }

    const enhancedTrigger = React.cloneElement(trigger, {
        onClick: (e: MouseEvent) => {
            dialogRef.current?.showModal()

            // Call the original onClick from the passed trigger
            if (trigger.props.onClick) {
                trigger.props.onClick(e)
            }
        },
    })

    const modalContent = (
        <dialog
            ref={dialogRef}
            id={modalId}
            className="modal modal-bottom sm:modal-middle"
        >
            <div className="modal-box flex flex-col gap-8">
                <div>
                    <h3 className="font-bold text-2xl">{modalTitle}</h3>
                    {modalDescription && (
                        <p className="text-xs font-light text-base-content/70">
                            {modalDescription}
                        </p>
                    )}
                </div>

                {children}

                <div className="flex justify-between gap-2">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                            onCancel?.()
                            closeModal()
                        }}
                    >
                        {cancelLabel || 'Cancel'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onConfirm}
                    >
                        {submitLabel || 'Confirm'}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop">
                <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close Modal"
                >
                    close
                </button>
            </div>
        </dialog>
    )

    return (
        <>
            {enhancedTrigger}
            {usePortal
                ? ReactDOM.createPortal(modalContent, document.body)
                : modalContent}
        </>
    )
}
