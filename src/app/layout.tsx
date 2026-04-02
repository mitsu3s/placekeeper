import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/globals.css'
import { APP_DESCRIPTION, APP_NAME } from '@/config/app'

export const metadata: Metadata = {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    icons: {
        icon: '/static/favicon.ico',
    },
}

interface RootLayoutProps {
    children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

