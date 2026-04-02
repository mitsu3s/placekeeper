import type { Metadata } from 'next'
import SignInPage from '@/features/auth/SignInPage'

export const metadata: Metadata = {
    title: 'Sign In - Place Keeper',
}

export default function SignInRoutePage() {
    return <SignInPage />
}

