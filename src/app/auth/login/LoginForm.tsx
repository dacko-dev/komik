'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import GoogleButton from '@/components/buttons/GoogleButton/GoogleButton'
import FacebookButton from '@/components/buttons/FacebookButton/FacebookButton'
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
            'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?)'
        ),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    })
    const onSubmit: SubmitHandler<LoginSchema> = (data) => console.log(data)

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-center flex-col px-20 py-10"
        >
            <h1 className="text-3xl  font-bold text-center mb-8">Welcome!</h1>
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
