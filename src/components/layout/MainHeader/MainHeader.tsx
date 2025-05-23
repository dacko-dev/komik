import AvatarDropdown from '@/components/layout/MainHeader/AvatarDropdown'
import MainSubheader from '@/components/layout/MainHeader/MainSubheader'
import Search from '@/components/layout/MainHeader/Search'
import ThemeButton from '@/components/layout/MainHeader/ThemeButton'
import Logo from '@/components/Logo/Logo'
import Dice from '@/components/miscellaneous/Dice/Dice'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import React from 'react'

export async function MainHeader() {
    const supabase = createClient()
    const user = await (await supabase).auth.getUser()

    return (
        <div className="col-span-full grid grid-cols-(--main-grid-cols)">
            <div className="col-span-full grid grid-cols-(--main-grid-cols) shadow-md bg-base-300">
                <header className="col-start-2 flex items-center justify-between col-end-3 navbar bg-base-300 sticky px-4 ">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <Dice size={30} />
                        <Search />
                    </div>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <ThemeButton />
                            </div>
                            <AvatarDropdown user={user} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/login">
                                <button className="btn btn-soft">Login</button>
                            </Link>
                            <Link href="/auth/signup">
                                <button className="btn btn-primary">
                                    Signup
                                </button>
                            </Link>
                        </div>
                    )}
                </header>
            </div>
            <MainSubheader />
        </div>
    )
}
