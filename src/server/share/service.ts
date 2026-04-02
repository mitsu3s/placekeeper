import 'server-only'
import { prisma } from '@/server/db/client'

export async function findShareByCode(shareId: string) {
    return prisma.share.findUnique({
        where: {
            shareId,
        },
    })
}

export async function getShareCodeForUser(userId: string) {
    const share = await prisma.share.findUnique({
        where: {
            userId,
        },
    })

    return share?.shareId ?? ''
}

export async function saveShareCode(userId: string, shareId: string) {
    return prisma.share.upsert({
        where: {
            userId,
        },
        update: {
            shareId,
        },
        create: {
            userId,
            shareId,
        },
    })
}
