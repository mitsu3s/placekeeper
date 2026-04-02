import { NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import {
    handleRouteError,
    parseJsonBody,
    requireNonEmptyString,
} from '@/server/api/http'
import { requireAuthenticatedSession } from '@/server/auth/session'
import { saveShareCode } from '@/server/share/service'

export const runtime = 'nodejs'

interface SaveShareCodeRequestBody {
    shareCode?: unknown
}

export async function POST(request: Request) {
    try {
        const session = await requireAuthenticatedSession()
        const body = await parseJsonBody<SaveShareCodeRequestBody>(request)
        const share = await saveShareCode(
            session.user.id,
            requireNonEmptyString(body.shareCode, 'shareCode')
        )

        return NextResponse.json({ shareId: share.shareId })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: 'Share code already exists' }, { status: 409 })
        }

        return handleRouteError(error)
    }
}
