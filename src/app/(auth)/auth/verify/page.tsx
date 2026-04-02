import type { Metadata } from 'next'
import VerifyRequestPage from '@/features/auth/VerifyRequestPage'

export const metadata: Metadata = {
    title: 'Auth Verify - Place Keeper',
}

export default function VerifyRoutePage() {
    return <VerifyRequestPage />
}

