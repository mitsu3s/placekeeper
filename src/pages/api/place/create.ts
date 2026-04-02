import type { NextApiRequest, NextApiResponse } from 'next'
import { assertMethod, handleApiError, requireNonEmptyString, requireNumber } from '@/server/api/http'
import { requireApiSession } from '@/server/auth/session'
import { createPlace } from '@/server/places/service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!assertMethod(req, res, 'POST')) {
        return
    }

    try {
        const session = await requireApiSession(req, res)
        const name = requireNonEmptyString(req.body?.name, 'name')
        const description = requireNonEmptyString(req.body?.description, 'description')
        const latitude = requireNumber(req.body?.latitude, 'latitude')
        const longitude = requireNumber(req.body?.longitude, 'longitude')

        const place = await createPlace({
            userId: session.user.id,
            name,
            description,
            latitude,
            longitude,
        })

        return res.status(200).json(place)
    } catch (error) {
        return handleApiError(res, error)
    }
}
