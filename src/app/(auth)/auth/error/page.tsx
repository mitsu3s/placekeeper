import type { Metadata } from 'next'
import AuthErrorPage from '@/features/auth/AuthErrorPage'

export const metadata: Metadata = {
    title: 'Auth Error - Place Keeper',
}

export default function AuthErrorRoutePage() {
    return <AuthErrorPage />
}

