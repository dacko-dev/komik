'use client'

import { UserResponse } from '@supabase/supabase-js'
import React, { useRef } from 'react'
import Avatar from 'boring-avatars'
import Link from 'next/link'

const links = [
    { name: 'Profile', href: '/dashboard' },
    { name: 'My Comics', href: '/settings' },
    { name: 'Saved', href: '/dashboard/saved' },
    { name: 'Settings', href: '/dashboard/settings' },
]

export default function AvatarDropdown({ user }: { user: UserResponse }) {
    const dropdownRef = useRef<HTMLUListElement>(null)

    return (
        <>
            <button
                onMouseEnter={() => {
                    if (dropdownRef.current?.popover) {
                        dropdownRef.current.showPopover()
                    }
                }}
                className="btn rounded-full p-0"
                popoverTarget="popover-avatar-menu"
                style={
                    {
                        anchorName: '--anchor-avatar-menu',
                    } as React.CSSProperties
                }
                aria-haspopup="dialog"
            >
                <Avatar
                    variant="beam"
                    className="h-10"
                    name={user.data.user?.email}
                />
            </button>
            <ul
                onMouseLeave={() => {
                    if (dropdownRef.current?.popover) {
                        dropdownRef.current.hidePopover()
                    }
                }}
                ref={dropdownRef}
                className="dropdown dropdown-end menu bg-base-100 rounded-box mt-2 w-52 p-2 shadow-sm"
                popover="auto"
                id="popover-avatar-menu"
                style={
                    {
                        positionAnchor: '--anchor-avatar-menu',
                    } as React.CSSProperties
                }
            >
                {links.map((link) => (
                    <li key={link.name}>
                        <Link href={link.href} className="">
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}
