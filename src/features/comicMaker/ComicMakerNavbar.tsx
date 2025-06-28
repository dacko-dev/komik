import { ChevronDownIcon, Share2Icon, SparklesIcon } from 'lucide-react'
import React from 'react'

export default function ComicMakerNavbar() {
    return (
        <header className="flex items-center justify-between w-full p-2 border-t border-b border-base-300">
            <input
                type="text"
                placeholder="Comic Title"
                className="w-full max-w-sm text-lg font-bold border-t-0 border-b-2 rounded-none shadow-none outline-none input focus:outline-none focus:ring-0 border-e-0 border-s-0 border-s-base-200 hover:bg-base-200 focus:bg-base-200 border-b-base-300/0 focus:border-base-300 placeholder:select-none"
            />

            <div className="flex items-center gap-2 md:gap-4">
                <NavbarDropdownMenu
                    name="comic-maker-navbar"
                    label="Import"
                    options={[
                        {
                            label: 'Panels',
                            onClick: () => console.log('Import Panels clicked'),
                        },
                        {
                            label: 'Comic',
                            tooltip: '',
                            onClick: () => console.log('Add Comic clicked'),
                        },
                    ]}
                />
                <button className="btn btn-secondary btn-sm">
                    Generate
                    <SparklesIcon size={16} />
                </button>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    type="button"
                    title="Share Comic"
                    aria-label="Share Comic"
                    className="btn btn-sm btn-soft btn-square"
                >
                    <Share2Icon size={16} />
                </button>
                <button className="btn btn-primary btn-sm ">Save</button>
            </div>
        </header>
    )
}

type DropdownButtonOption = {
    label: React.ReactNode
    tooltip?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

type DropdownButtonProps = {
    mainButton: DropdownButtonOption
    options: DropdownButtonOption[]
    name: string // used for popover names
}

// Dropdown with usable main button label
function NavbarDropdownButton({
    mainButton,
    options,
    name,
}: DropdownButtonProps) {
    return (
        <div>
            <div className="flex items-center gap-0 flex-nowrap">
                <button
                    type="button"
                    className="btn btn-sm btn-soft rounded-e-none"
                >
                    {mainButton.label}
                </button>
                <button
                    type="button"
                    popoverTarget={`popover-${name}`}
                    style={
                        {
                            anchorName: `--anchor-${name}`,
                        } as React.CSSProperties
                    }
                    className="p-0 btn btn-sm btn-soft rounded-s-none"
                >
                    <ChevronDownIcon size={16} />
                </button>
            </div>

            <ul
                className="p-0 mt-1 shadow-sm dropdown dropdown-end menu rounded-box bg-base-100"
                popover="auto"
                id={`popover-${name}`}
                style={
                    {
                        positionAnchor: `--anchor-${name}`,
                    } as React.CSSProperties
                }
            >
                {options.map((option, idx) => (
                    <li key={idx}>
                        <button
                            className="btn btn-sm"
                            onClick={option.onClick}
                            title={option.tooltip}
                        >
                            {option.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// Dropdown without button as a label
function NavbarDropdownMenu({
    label,
    options,
    name,
}: Omit<DropdownButtonProps, 'mainButton'> & {
    label: React.ReactNode
}) {
    return (
        <div className="dropdown dropdown-hover">
            <div
                tabIndex={0}
                role="button"
                className="cursor-auto btn btn-sm btn-soft"
            >
                {label}
            </div>

            <ul
                tabIndex={0}
                className="p-0 pt-1 shadow-sm dropdown-content menu dropdown-end rounded-box bg-base-100"
            >
                {options.map((option, idx) => (
                    <li key={idx}>
                        <button
                            className="btn btn-sm"
                            onClick={option.onClick}
                            title={option.tooltip}
                        >
                            {option.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
