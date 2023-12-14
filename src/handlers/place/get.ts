import { PrismaClient } from '@prisma/client'
import { Place } from '@prisma/client'

const prisma = new PrismaClient()

export const getPlaces = async (userId: string): Promise<Place[]> => {
    const places = await prisma.place.findMany({
        where: {
            userId: userId,
        },
    })
    return places
}
