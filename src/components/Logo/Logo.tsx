import { smoochSans } from '@/app/fonts'
import React from 'react'

export default function Logo() {
    const letterClassName =
        'text-xl font-bold bg-white p-1 rounded-xs w-8 h-8 text-black flex items-center justify-center'

    return (
        <h1
            className={`flex items-center gap-2 ${smoochSans.variable} ${smoochSans.className}`}
        >
            <span className={`${letterClassName}`}>K</span>
            <span className={`${letterClassName} mb-2`}>O</span>
            <span className={`${letterClassName}`}>M</span>
            <span className={`${letterClassName} mt-2`}>I</span>
            <span className={`${letterClassName}`}>K</span>
        </h1>
    )
}
