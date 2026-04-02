import { NextResponse } from 'next/server'
import {
    handleRouteError,
    parseJsonBody,
    requireNonEmptyString,
    requireNumber,
} from '@/server/api/http'
import { requireAuthenticatedSession } from '@/server/auth/session'
import { createPlace } from '@/server/places/service'

export const runtime = 'nodejs'

interface CreatePlaceRequestBody {
    name?: unknown
    description?: unknown
    latitude?: unknown
    longitude?: unknown
}

export async function POST(request: Request) {
    try {
        const session = await requireAuthenticatedSession()
        const body = await parseJsonBody<CreatePlaceRequestBody>(request)

        const place = await createPlace({
            userId: session.user.id,
            name: requireNonEmptyString(body.name, 'name'),
            description: requireNonEmptyString(body.description, 'description'),
            latitude: requireNumber(body.latitude, 'latitude'),
            longitude: requireNumber(body.longitude, 'longitude'),
        })

        return NextResponse.json(place)
    } catch (error) {
        return handleRouteError(error)
    }
}

