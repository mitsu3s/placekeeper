import HomePage from '@/features/home/HomePage'
import { auth } from '@/server/auth/session'

interface HomeRoutePageProps {
    searchParams: Promise<{
        invalidShareCode?: string
    }>
}

export default async function HomeRoutePage({ searchParams }: HomeRoutePageProps) {
    const session = await auth()
    const resolvedSearchParams = await searchParams

    return (
        <HomePage
            isAuthenticated={Boolean(session?.user?.id)}
            showInvalidShareCodeToast={resolvedSearchParams.invalidShareCode === 'true'}
        />
    )
}
