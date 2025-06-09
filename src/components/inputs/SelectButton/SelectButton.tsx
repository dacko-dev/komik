import Tooltip from '@/components/ui/Tooltip/Tooltip'
import { ChevronDown } from 'lucide-react'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

type Option<T> = { value: T; label: string }

type SelectButtonProps<T extends string | number = string | number> = {
    label: string | React.ReactNode
    tooltip?: string
    options: Option<T>[]
    value: T | null
    onChange: (value: T) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    labelClassName?: string
    wrapperClassName?: string
}

export default function SelectButton<
    T extends string | number = string | number
>({
    label,
    tooltip,
    options,
    value,
    onChange,
    placeholder = 'Select',
    disabled = false,
    className = '',
    labelClassName = '',
    wrapperClassName = '',
}: SelectButtonProps) {
    const id = useId()
    const buttonRef = useRef<HTMLButtonElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)

    const selectedLabel =
        options.find((option) => option.value === value)?.label || placeholder

    const toggleOpen = () => {
        if (disabled) return
        setOpen((prev) => !prev)
    }

    const handleSelect = useCallback(
        (optionValue: T) => {
            onChange(optionValue)
            setOpen(false)
            buttonRef.current?.focus()
        },
        [onChange]
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
            listRef.current?.querySelector('li')?.focus()
        }
    }

    const handleOptionKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLLIElement>, optionValue: T) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSelect(optionValue)
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                ;(
                    e.currentTarget.nextElementSibling as HTMLElement | null
                )?.focus()
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault()
                ;(
                    e.currentTarget.previousElementSibling as HTMLElement | null
                )?.focus()
            }
            if (e.key === 'Escape') {
                e.preventDefault()
                setOpen(false)
                buttonRef.current?.focus()
            }
        },
        [handleSelect]
    )

    // Close on outside click OR focus leaves component
    useEffect(() => {
        if (!open) return

        const handleFocusOrClickOutside = (e: FocusEvent | MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('focusin', handleFocusOrClickOutside)
        document.addEventListener('mousedown', handleFocusOrClickOutside)

        return () => {
            document.removeEventListener('focusin', handleFocusOrClickOutside)
            document.removeEventListener('mousedown', handleFocusOrClickOutside)
        }
    }, [open])

    return (
        <div ref={wrapperRef} className={`relative ${wrapperClassName}`}>
            <Tooltip tooltip={tooltip}>
                <button
                    ref={buttonRef}
                    id={id}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-labelledby={`${id}-label`}
                    aria-controls={`${id}-listbox`}
                    onClick={toggleOpen}
                    onKeyDown={handleKeyDown}
                    className={`btn flex justify-between items-center w-full p-0 gap-0 ${className}`}
                >
                    <label
                        htmlFor={id}
                        id={`${id}-label`}
                        className={`grow-0 flex items-center font-light text-sm border-r-2 self-stretch border-base-300 cursor-pointer p-2 ${labelClassName}`}
                    >
                        {label}
                    </label>
                    <div className="flex grow whitespace-nowrap text-sm px-2 items-center justify-center w-full">
                        <span>{selectedLabel}</span>
                    </div>
                    <div className="pr-2">
                        <ChevronDown
                            className={` h-5 w-5 transition-transform ${
                                open ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                        />
                    </div>
                </button>
            </Tooltip>

            {open && (
                <ul
                    ref={listRef}
                    role="listbox"
                    aria-labelledby={`${id}-label`}
                    id={`${id}-listbox`}
                    tabIndex={-1}
                    className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-base-100 shadow-lg ring-1 ring-base-300 focus:outline-none"
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            role="option"
                            tabIndex={0}
                            aria-selected={option.value === value}
                            className={`px-4 py-2 cursor-pointer hover:bg-base-200 first-of-type:rounded-t-md last-of-type:rounded-b-md ${
                                option.value === value ? 'bg-base-300' : ''
                            }`}
                            onClick={() => handleSelect(option.value as T)}
                            onKeyDown={(e) =>
                                handleOptionKeyDown(e, option.value as T)
                            }
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
