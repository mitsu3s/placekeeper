import { fetchJson } from '@/lib/fetch-json'
import type { PlaceItem } from '@/features/places/types'

interface CreatePlaceRequest {
    name: string
    description: string
    latitude: number
    longitude: number
}

export async function createPlaceRequest(payload: CreatePlaceRequest) {
    return fetchJson<PlaceItem>('/api/places', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function deletePlaceRequest(placeId: string) {
    return fetchJson<{ deleted: true }>(`/api/places/${placeId}`, {
        method: 'DELETE',
    })
}
