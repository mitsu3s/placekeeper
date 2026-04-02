import { SHARE_MAP_ROUTE } from '@/config/app'

export function buildShareMapUrl(shareCode: string) {
    const baseUrl =
        typeof window === 'undefined'
            ? (process.env.NEXT_PUBLIC_URL ?? '')
            : window.location.origin

    return `${baseUrl}${SHARE_MAP_ROUTE}?sharecode=${encodeURIComponent(shareCode)}`
}

