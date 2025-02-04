'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { signupSchema, TSignupSchema } from '@/lib/schemas/signupSchema'
import { TActionResponse } from '@/types'

export async function signupAction(data: TSignupSchema) {
    const supabase = await createClient()

    const parsed = signupSchema.safeParse(data)

    if (!parsed.success) {
        return {
            isError: true,
            message: parsed.error.errors[0].message,
        } as TActionResponse
    }

    const { error } = await supabase.auth.signUp(parsed.data)

    if (error) {
        console.error('Error signing up:', error.message)
        return {
            isError: true,
            message: 'Something went wrong. Please try again later.',
        } as TActionResponse
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
