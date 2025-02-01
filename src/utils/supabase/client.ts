import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
    if (!supabaseUrl) {
        throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
    }
    if (!supabaseAnonKey) {
        throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
