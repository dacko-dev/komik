import MainSubheader from '@/components/layout/MainHeader/MainSubheader'
import Search from '@/components/layout/MainHeader/Search'
import Logo from '@/components/Logo/Logo'
import Link from 'next/link'
import React from 'react'

export function MainHeader() {
    return (
        <div className="col-span-full grid grid-cols-(--main-grid-cols)">
            <div className="col-span-full grid grid-cols-(--main-grid-cols) shadow-sm bg-base-300">
                <header className="col-start-2 flex items-center justify-between col-end-3 navbar bg-base-300 shadow-sm sticky px-4 ">
                    <Logo />
                    <Search />
                    <div className="flex items-center gap-2">
                        <Link href="/auth/login">
                            <button className="btn btn-soft">Login</button>
                        </Link>
                        <Link href="/auth/signup">
                            <button className="btn btn-primary">Signup</button>
                        </Link>
                    </div>
                </header>
            </div>
            <MainSubheader />
        </div>
    )
}
