export class HttpRequestError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string
    ) {
        super(message)
        this.name = 'HttpRequestError'
    }
}

type JsonValue = Record<string, unknown> | null

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
        ...init,
    })

    const isJsonResponse = response.headers.get('content-type')?.includes('application/json')
    const payload = isJsonResponse ? ((await response.json()) as JsonValue) : null

    if (!response.ok) {
        const message =
            payload && typeof payload.error === 'string' ? payload.error : 'Request failed'

        throw new HttpRequestError(response.status, message)
    }

    return payload as T
}

