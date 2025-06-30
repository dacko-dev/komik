'use client'

import { DrawingBoardToolbarButton } from '@/features/drawingBoard/components/DrawingBoardToolbar/DrawingBoardToolbarButton'
import { DrawAction } from '@/contexts/drawingBoardContext'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Option = {
    label: string
    tooltip?: string
    icon: React.ReactNode
    value: DrawAction
}

interface ToolbarSelectProps {
    name: string
    options: Option[]
    activeOption: DrawAction
    onChange: (value: DrawAction) => void
    isActive?: boolean
}

export function DrawingBoardToolbarSelect({
    name,
    options,
    activeOption,
    onChange,
    isActive,
}: ToolbarSelectProps) {
    const dropdownRef = useRef<HTMLUListElement>(null)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [lastSelectedOption, setLastSelectedOption] = useState<DrawAction>(
        () => {
            const found = options.find((opt) => opt.value === activeOption)
            return found ? activeOption : options[0].value
        }
    )

    useEffect(() => {
        const isCurrentInOptions = options.some(
            (opt) => opt.value === activeOption
        )
        if (isCurrentInOptions) {
            setLastSelectedOption(activeOption)
        }
    }, [activeOption, options])

    // Listen for popover open/close
    useEffect(() => {
        const el = dropdownRef.current
        if (!el) return

        const observer = new MutationObserver(() => {
            setIsDropdownOpen(el.matches(':popover-open'))
        })

        observer.observe(el, { attributes: true, attributeFilter: ['popover'] })
        return () => observer.disconnect()
    }, [])

    const selectedIcon = options.find(
        (opt) => opt.value === lastSelectedOption
    )?.icon

    return (
        <>
            <div className="flex gap-0 p-0">
                <DrawingBoardToolbarButton
                    tooltip={
                        options.find((opt) => opt.value === lastSelectedOption)
                            ?.label || 'Select'
                    }
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        onChange(lastSelectedOption)
                    }}
                    className={`rounded-e-none ${
                        isActive ? 'btn-secondary' : ''
                    }`}
                >
                    {selectedIcon}
                </DrawingBoardToolbarButton>
                <button
                    type="button"
                    popoverTarget={`popover-${name}`}
                    style={
                        {
                            anchorName: `--anchor-${name}`,
                        } as React.CSSProperties
                    }
                    className={`p-0 btn btn-sm rounded-s-none
                            ${isActive ? 'btn-secondary' : ''}
                        `}
                >
                    {isDropdownOpen ? (
                        <ChevronUpIcon size={12} />
                    ) : (
                        <ChevronDownIcon size={12} />
                    )}
                </button>
            </div>

            <ul
                ref={dropdownRef}
                className="dropdown dropdown-end border-0 p-1 menu rounded-box bg-base-300 shadow-sm mt-[2px] me-[10px]"
                popover="auto"
                id={`popover-${name}`}
                style={
                    {
                        positionAnchor: `--anchor-${name}`,
                    } as React.CSSProperties
                }
            >
                {options.map((option, idx) => (
                    <li key={option.value}>
                        <button
                            popoverTarget={`popover-${name}`}
                            popoverTargetAction="hide"
                            className={`btn btn-sm btn-square 
                                ${
                                    lastSelectedOption === option.value &&
                                    'btn-neutral'
                                }

                                ${
                                    idx === 0
                                        ? 'rounded-b-none'
                                        : idx === options.length - 1
                                        ? 'rounded-t-none'
                                        : 'rounded-none'
                                }`}
                            onClick={() => onChange(option.value)}
                        >
                            {option.icon}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    )
}
