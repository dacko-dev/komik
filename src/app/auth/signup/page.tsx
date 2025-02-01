import SignupForm from '@/app/auth/signup/SignupForm'
import Image from 'next/image'
import React from 'react'

export default function SignupPage() {
    return (
        <div className="card card-border rounded-sm bg-base-100 w-full h-full sm:w-auto sm:h-auto overflow-scroll sm:overflow-auto grid grid-cols-1 lg:grid-cols-2 shadow-xl">
            <div className="hidden lg:block">
                <Image
                    src="/assets/images/signup_image.jpg"
                    alt="logo"
                    width={473}
                    height={612}
                />
            </div>
            <SignupForm />
        </div>
    )
}
