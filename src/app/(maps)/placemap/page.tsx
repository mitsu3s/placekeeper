import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import OwnerMapPage, { type OwnerMapPageProps } from '@/features/map/OwnerMapPage'
import { HOME_ROUTE } from '@/config/app'
import { auth } from '@/server/auth/session'
import { listPlacesForUser } from '@/server/places/service'
import { getShareCodeForUser } from '@/server/share/service'

export const metadata: Metadata = {
    title: 'Owner Map - Place Keeper',
}

export default async function OwnerMapRoutePage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect(HOME_ROUTE)
    }

    let initialPlaces: OwnerMapPageProps['initialPlaces']
    let initialShareCode: OwnerMapPageProps['initialShareCode']

    try {
        ;[initialPlaces, initialShareCode] = await Promise.all([
            listPlacesForUser(session.user.id),
            getShareCodeForUser(session.user.id),
        ])
    } catch (error) {
        console.error(error)
        redirect(HOME_ROUTE)
    }

    return (
        <OwnerMapPage
            initialPlaces={initialPlaces}
            initialShareCode={initialShareCode}
            userEmail={session.user.email ?? null}
        />
    )
}
