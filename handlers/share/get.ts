import { PrismaClient } from '@prisma/client'
import { Share } from '@prisma/client'

const prisma = new PrismaClient()

export const getAdmin = async (shareId: string): Promise<Share | undefined> => {
    const share = await prisma.share.findUnique({
        where: {
            shareId: shareId,
        },
    })
    return share || undefined
}

export const getShareId = async (userId: string): Promise<string> => {
    const share = await prisma.share.findUnique({
        where: {
            userId: userId,
        },
    })
    return share?.shareId || ''
}
