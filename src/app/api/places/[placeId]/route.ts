import { NextResponse } from 'next/server'
import { ApiError, handleRouteError, requireNonEmptyString } from '@/server/api/http'
import { requireAuthenticatedSession } from '@/server/auth/session'
import { deletePlaceForUser } from '@/server/places/service'

export const runtime = 'nodejs'

interface DeletePlaceRouteContext {
    params: Promise<{
        placeId: string
    }>
}

export async function DELETE(
    _request: Request,
    { params }: DeletePlaceRouteContext
) {
    try {
        const session = await requireAuthenticatedSession()
        const { placeId } = await params
        const normalizedPlaceId = requireNonEmptyString(placeId, 'placeId')
        const wasDeleted = await deletePlaceForUser(normalizedPlaceId, session.user.id)

        if (!wasDeleted) {
            throw new ApiError(404, 'Place not found')
        }

        return NextResponse.json({ deleted: true })
    } catch (error) {
        return handleRouteError(error)
    }
}
