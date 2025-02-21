'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const hideSubheaderPaths = ['/add', '/dashboard']

export default function MainSubheader() {
    const pathname = usePathname()
    if (hideSubheaderPaths.some((path) => pathname.includes(path))) {
        return null
    }

    return (
        <div className="flex items-center col-start-2 col-end-3 gap-2 py-2 w-full justify-stretch">
            <SubheaderLink href="" text="Top" />
            <SubheaderLink href="" text="New" />
            <SubheaderDropdown text="Tags">
                <li>
                    <a>Item 1</a>
                </li>
                <li>
                    <a>Item 2</a>
                </li>
            </SubheaderDropdown>
            <SubheaderDropdown text="Genres">
                <li>
                    <a>Item 1</a>
                </li>
                <li>
                    <a>Item 2</a>
                </li>
            </SubheaderDropdown>
        </div>
    )
}

function SubheaderLink({ href, text }: { href: string; text: string }) {
    return (
        <Link href={href} className="btn grow">
            {text}
        </Link>
    )
}

function SubheaderDropdown({
    text,
    children,
}: {
    text: string
    children: React.ReactNode
}) {
    return (
        <div className="dropdown dropdown-hover grow z-1">
            <div tabIndex={0} role="button" className="btn m-1 w-full">
                {text}
                <ChevronDown className="w-4 h-4" />
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content  menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
            >
                {children}
            </ul>
        </div>
    )
}
