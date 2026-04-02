import type { Place } from '@prisma/client'
import { prisma } from '@/server/db/client'

interface CreatePlaceInput {
    userId: string
    name: string
    description: string
    latitude: number
    longitude: number
}

export async function listPlacesForUser(userId: string): Promise<Place[]> {
    return prisma.place.findMany({
        where: {
            userId,
        },
    })
}

export async function createPlace(input: CreatePlaceInput) {
    return prisma.place.create({
        data: input,
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

