import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getShare = async (userId: string): Promise<string> => {
    const share = await prisma.share.findUnique({
        where: {
            userId: userId,
        },
    })
    return share?.shareId || ''
}
