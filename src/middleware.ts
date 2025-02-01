import { updateSession } from '@/utils/supabase/middleware'
import { type NextRequest } from 'next/server'

export const PUBLIC_PATHS = ['auth', 'dashboard']

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - homepage ($ after beginning)
         * - public paths (defined in PUBLIC_PATHS array)
         * Feel free to modify this pattern to include more paths.
         */
        `/((?!_next/static|_next/image|favicon.ico|${PUBLIC_PATHS.join(
            '|'
        )}|$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
    ],
}
