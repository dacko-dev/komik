import React from 'react'

export default function RoundedIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
            className={`lucide lucide-square-round-corner-icon lucide-square-round-corner ${props.className}`}
        >
            <path d="M21 11a8 8 0 0 0-8-8" />
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        </svg>
    )
}
