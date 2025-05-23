// ReactScan must be the top-most import in this file!
import { ReactScan } from '@/components/miscellaneous/ReactScan/ReactScan'
import type { Metadata } from 'next'
import './globals.css'
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants'
import { smoochSans } from '@/app/fonts'
import { Toaster } from 'react-hot-toast'
// const smoochSans = Geist({
//     variable: '--font-geist-sans',
//     subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//     variable: '--font-geist-mono',
//     subsets: ['latin'],
// })

export const metadata: Metadata = {
    title: APP_NAME,
    description: APP_DESCRIPTION,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <ReactScan />
            <body
                className={`${smoochSans.variable} ${smoochSans.variable} antialiased`}
            >
                <Toaster
                    toastOptions={{
                        position: 'bottom-right',
                        className: 'alert',
                        success: {
                            className: 'alert-success',
                        },
                        error: {
                            className: 'alert-error',
                        },
                        blank: {
                            className: 'alert-info',
                        },
                    }}
                />
                {children}
            </body>
        </html>
    )
}
