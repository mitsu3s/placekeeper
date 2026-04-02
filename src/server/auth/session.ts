import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { ApiError } from '@/server/api/http'
import { authOptions } from '@/server/auth/options'

export async function requireApiSession(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.id) {
        throw new ApiError(401, 'Authentication required')
    }

    return session
}

