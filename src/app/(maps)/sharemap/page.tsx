import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SharedMapPage, { type SharedMapPageProps } from '@/features/map/SharedMapPage'
import { HOME_ROUTE } from '@/config/app'
import { listPlacesForUser } from '@/server/places/service'
import { findShareByCode } from '@/server/share/service'

export const metadata: Metadata = {
    title: 'Share Map - Place Keeper',
}

interface SharedMapRoutePageProps {
    searchParams: Promise<{
        sharecode?: string
    }>
}

export default async function SharedMapRoutePage({ searchParams }: SharedMapRoutePageProps) {
    const resolvedSearchParams = await searchParams
    const shareCode = resolvedSearchParams.sharecode?.trim()

    if (!shareCode) {
        redirect(HOME_ROUTE)
    }

    let places: SharedMapPageProps['places']

    try {
        const share = await findShareByCode(shareCode)

        if (!share) {
            redirect('/?invalidShareCode=true')
        }

        places = await listPlacesForUser(share.userId)
    } catch (error) {
        console.error(error)
        redirect(HOME_ROUTE)
    }

    return <SharedMapPage places={places} />
}
