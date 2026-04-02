import 'server-only'
import { NextResponse } from 'next/server'

export class ApiError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
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

export async function parseJsonBody<T>(request: Request): Promise<T> {
    try {
        return (await request.json()) as T
    } catch {
        throw new ApiError(400, 'Invalid request body')
    }
}

export function handleRouteError(error: unknown) {
    if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
