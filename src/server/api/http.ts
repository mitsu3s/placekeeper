import type { NextApiRequest, NextApiResponse } from 'next'

export class ApiError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

export function assertMethod(
    req: NextApiRequest,
    res: NextApiResponse,
    expectedMethod: 'GET' | 'POST'
) {
    if (req.method === expectedMethod) {
        return true
    }

    res.setHeader('Allow', expectedMethod)
    res.status(405).json({ error: `Method ${req.method ?? 'UNKNOWN'} not allowed` })
    return false
}

export function requireNonEmptyString(value: unknown, fieldName: string) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new ApiError(400, `${fieldName} is required`)
    }

    return value.trim()
}

export function requireNumber(value: unknown, fieldName: string) {
    const parsedValue = typeof value === 'number' ? value : Number(value)

    if (!Number.isFinite(parsedValue)) {
        throw new ApiError(400, `${fieldName} must be a valid number`)
    }

    return parsedValue
}

export function handleApiError(res: NextApiResponse, error: unknown) {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ error: error.message })
    }

    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
}

