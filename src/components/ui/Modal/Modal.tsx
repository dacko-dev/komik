'use client'

import React, {
    MouseEvent,
    useEffect,
    useRef,
    useState,
    useTransition,
} from 'react'
import ReactDOM from 'react-dom'
import toast from 'react-hot-toast'

type TriggerWithOnClick = React.ReactElement<{
    onClick: (e: MouseEvent) => void
}>

type ModalProps = {
    modalId: string
    modalTitle: string
    modalDescription?: string
    trigger: TriggerWithOnClick
    onConfirmAction: () => Promise<{ error: boolean; message?: string }>
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
    onConfirmAction,
    onCancel,
    usePortal = false,
    children,
}: ModalProps) {
    const [mounted, setMounted] = useState(false)
    const [isPending, startTransition] = useTransition()
    useEffect(() => {
        setMounted(true)
    }, [])
    const dialogRef = useRef<HTMLDialogElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    if (usePortal && !mounted) return null

    function performOnConfirmAction() {
        startTransition(async () => {
            const data = await onConfirmAction()
            if (data.error) {
                toast.error(data.message ?? 'Error')
            }
        })
    }
    const closeModal = () => {
        dialogRef.current?.close()
        previousActiveElement.current?.focus()
    }

    const enhancedTrigger = React.cloneElement(trigger, {
        onClick: (e: MouseEvent) => {
            previousActiveElement.current =
                document.activeElement as HTMLElement
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
                        className="btn "
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
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            performOnConfirmAction()
                        }}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="loading loading-spinner" />
                        ) : submitLabel ? (
                            submitLabel
                        ) : (
                            'Confirm'
                        )}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop">
                <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close Modal"
                >
                    Close
                </button>
            </div>
        </dialog>
    )

    return (
        <>
            {enhancedTrigger}
            {usePortal && typeof document !== 'undefined'
                ? ReactDOM.createPortal(modalContent, document.body)
                : modalContent}
        </>
    )
}
