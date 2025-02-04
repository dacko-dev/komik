'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, TSignupSchema } from '@/lib/schemas/signupSchema'
import { signupAction } from '@/actions/signupAction'
import toast from 'react-hot-toast'

export default function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, disabled },
    } = useForm<TSignupSchema>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit: SubmitHandler<TSignupSchema> = async (
        data: TSignupSchema
    ) => {
        const result = await signupAction(data)
        if (result.isError) {
            console.error('Error signing up:', result.message)
            toast.error(result.message)
        }
    }

    const isFormDisabled = isSubmitting || disabled
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-center flex-col px-20 py-10"
        >
            <h1 className="text-3xl font-bold text-center mb-8">Welcome!</h1>
            <fieldset className="fieldset items-stretch justify-center flex flex-col gap-2 w-full max-w-[300px]">
                <div className="w-full grow">
                    <label className="fieldset-label mb-1">Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        className="input w-full"
                        placeholder="email@komic.com"
                        required
                    />
                    {errors.email && (
                        <p className="text-error">{errors.email.message}</p>
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
                        <p className="text-error">{errors.password.message}</p>
                    )}
                </div>

                <button
                    disabled={isFormDisabled}
                    type="submit"
                    className={`btn btn-primary w-full mt-2`}
                >
                    <span
                        className={`${
                            isSubmitting ? 'loading loading-spinner' : ''
                        }`}
                    >
                        Signup
                    </span>
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
