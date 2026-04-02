import 'server-only'
import { getServerSession } from 'next-auth'
import { ApiError } from '@/server/api/http'
import { authOptions } from '@/server/auth/options'

export function auth() {
    return getServerSession(authOptions)
}

export async function requireAuthenticatedSession() {
    const session = await auth()

    if (!session?.user?.id) {
        throw new ApiError(401, 'Authentication required')
    }

    return session
}
