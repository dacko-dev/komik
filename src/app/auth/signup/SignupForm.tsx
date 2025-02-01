'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters'),
})

type signupSchema = z.infer<typeof signupSchema>

export default function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<signupSchema>({
        resolver: zodResolver(signupSchema),
    })
    const onSubmit: SubmitHandler<signupSchema> = (data) => console.log(data)

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-center flex-col px-20 py-10"
        >
            <h1 className="text-3xl font-bold text-center mb-8">Welcome!</h1>
            <fieldset className="fieldset items-stretch justify-center flex flex-col gap-2 w-full">
                <div>
                    <label className="fieldset-label mb-1">Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        className="input w-full"
                        placeholder="email@komic.com"
                        required
                    />
                    {errors.email && (
                        <span className="text-error">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div>
                    <label className="fieldset-label mb-1">Password</label>
                    <input
                        type="password"
                        className="input w-full"
                        placeholder="**********"
                        {...register('password')}
                        required
                    />
                    {errors.password && (
                        <span className="text-error">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-full  mt-2">
                    Signup
                </button>
                <p className="text-sm text-center">or</p>

                <button className="btn bg-white text-black/70 w-full px-4 flex items-center gap-2">
                    <Image
                        src="/assets/logos/google.png"
                        alt="Google"
                        width={20}
                        height={20}
                    />
                    <span>Sign up with Google</span>
                </button>
                <button className="btn bg-[#0165E1] text-white/90 w-full px-4 flex items-center gap-2">
                    <Image
                        src="/assets/logos/facebook_white.png"
                        alt="Facebook"
                        width={20}
                        height={20}
                    />
                    <span>Sign up with Facebook</span>
                </button>
                <p className="text-sm text-center mt-4">
                    <span className="opacity-90">Already have an account?</span>{' '}
                    <Link href="/auth/login" className="link link-info">
                        Login
                    </Link>
                </p>
            </fieldset>
        </form>
    )
}
