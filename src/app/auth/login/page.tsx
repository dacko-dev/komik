import Image from 'next/image'
import React from 'react'
import LoginForm from '@/app/auth/login/LoginForm'

export default function LoginPage() {
    return (
        <div className="card rounded-sm bg-base-100 w-full h-full sm:w-auto sm:h-auto overflow-scroll sm:overflow-auto grid grid-cols-1 lg:grid-cols-2 shadow-xl">
            <div className="hidden lg:block">
                <Image
                    src="/assets/images/login_image.avif"
                    alt="logo"
                    width={473}
                    height={612}
                />
            </div>
            <LoginForm />
        </div>
    )
}
