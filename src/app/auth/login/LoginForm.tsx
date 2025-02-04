'use client'

import Link from 'next/link'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import GoogleButton from '@/components/buttons/GoogleButton/GoogleButton'
import FacebookButton from '@/components/buttons/FacebookButton/FacebookButton'
import { loginSchema, TLoginSchema } from '@/lib/schemas/loginSchema'
import { loginAction } from '@/actions/loginAction'
import toast from 'react-hot-toast'

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
    })
    const onSubmit: SubmitHandler<TLoginSchema> = async (
        data: TLoginSchema
    ) => {
        const result = await loginAction(data)
        if (result.isError) {
            console.error('Error signing up:', result.message)
            toast.error(result.message)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-center flex-col px-20 py-10"
        >
            <h1 className="text-3xl  font-bold text-center mb-8">Welcome!</h1>
            <fieldset className="fieldset items-stretch justify-center flex flex-col gap-2 w-full max-w-[300px]">
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

                <button
                    type="submit"
                    className={`btn btn-primary w-full mt-2 ${
                        isSubmitting ? 'loading loading-spinner' : ''
                    }`}
                >
                    Login
                </button>
                <p className="text-sm text-center">or</p>

                <GoogleButton>Continue with Google</GoogleButton>
                <FacebookButton>Continue with Facebook</FacebookButton>
                <p className="text-sm text-center mt-4">
                    <span className="opacity-90">
                        Don&apos;t have an account?
                    </span>{' '}
                    <Link href="/auth/signup" className="link link-info">
                        Register
                    </Link>
                </p>

                <p className="text-sm text-center">
                    <span className="opacity-90">Forgot your password?</span>{' '}
                    <Link
                        href="/auth/forgot-password"
                        className="link link-info"
                    >
                        Reset Password
                    </Link>
                </p>
            </fieldset>
        </form>
    )
}
