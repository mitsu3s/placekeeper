import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { assertMethod, handleApiError, requireNonEmptyString } from '@/server/api/http'
import { requireApiSession } from '@/server/auth/session'
import { saveShareCode } from '@/server/share/service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!assertMethod(req, res, 'POST')) {
        return
    }

    try {
        const session = await requireApiSession(req, res)
        const shareCode = requireNonEmptyString(req.body?.shareCode, 'shareCode')
        const share = await saveShareCode(session.user.id, shareCode)

        return res.status(200).json({ shareId: share.shareId })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ error: 'Share code already exists' })
        }

        return handleApiError(res, error)
    }
}
