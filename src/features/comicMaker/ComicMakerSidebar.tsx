import { MenuIcon } from 'lucide-react'
import { useState } from 'react'

export default function ComicMakerSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <aside
            className={`flex flex-col items-center grow h-full gap-4 p-4 border-r border-base-300`}
        >
            <button
                className="btn btn-ghost btn-square mb-4"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Sidebar"
            >
                <MenuIcon size={24} />
            </button>
            <ul className="menu bg-base-200 w-full rounded-none border-neutral">
                <li>
                    <a>Item 1</a>
                </li>
                <li>
                    <a>Item 2</a>
                </li>
                <li>
                    <a>Item 3</a>
                </li>
            </ul>
        </aside>
    )
}

function SidebarButton({
    label,
    icon: Icon,
    onClick,
    isActive = false,
}: {
    label: string
    icon: React.ComponentType<{ size?: number }>
    onClick: () => void
    isActive?: boolean
}) {
    return (
        <button
            className="flex items-center gap-2 p-2 w-full text-left hover:bg-base-300 rounded"
            onClick={onClick}
        >
            <Icon size={20} />
            <span>{label}</span>
        </button>
    )
}
