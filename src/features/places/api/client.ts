import type { Place } from '@prisma/client'
import { fetchJson } from '@/lib/fetch-json'

interface CreatePlaceRequest {
    name: string
    description: string
    latitude: number
    longitude: number
}

export async function createPlaceRequest(payload: CreatePlaceRequest) {
    return fetchJson<Place>('/api/place/create', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function deletePlaceRequest(placeId: string) {
    return fetchJson<{ deleted: true }>('/api/place/delete', {
        method: 'POST',
        body: JSON.stringify({ placeId }),
    })
}

