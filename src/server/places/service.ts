import 'server-only'
import type { PlaceItem } from '@/features/places/types'
import { prisma } from '@/server/db/client'

const placeSelect = {
    id: true,
    name: true,
    description: true,
    latitude: true,
    longitude: true,
} as const

interface CreatePlaceInput {
    userId: string
    name: string
    description: string
    latitude: number
    longitude: number
}

export async function listPlacesForUser(userId: string): Promise<PlaceItem[]> {
    return prisma.place.findMany({
        where: {
            userId,
        },
        select: placeSelect,
    })
}

export async function createPlace(input: CreatePlaceInput) {
    return prisma.place.create({
        data: input,
        select: placeSelect,
    })
}

export async function deletePlaceForUser(placeId: string, userId: string) {
    const result = await prisma.place.deleteMany({
        where: {
            id: placeId,
            userId,
        },
    })

    return result.count > 0
}
