import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, assertMethod, handleApiError, requireNonEmptyString } from '@/server/api/http'
import { requireApiSession } from '@/server/auth/session'
import { deletePlaceForUser } from '@/server/places/service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!assertMethod(req, res, 'POST')) {
        return
    }

    try {
        const session = await requireApiSession(req, res)
        const placeId = requireNonEmptyString(req.body?.placeId, 'placeId')
        const wasDeleted = await deletePlaceForUser(placeId, session.user.id)

        if (!wasDeleted) {
            throw new ApiError(404, 'Place not found')
        }

        return res.status(200).json({ deleted: true })
    } catch (error) {
        return handleApiError(res, error)
    }
}
