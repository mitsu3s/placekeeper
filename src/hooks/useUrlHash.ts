'use client'

import { useCallback, useState } from 'react'
import { extractHash } from '@/lib/hash'

export function useUrlHash(): readonly [string, (newHash: string) => void] {
    const [hash, setHash] = useState(() =>
        typeof window === 'undefined' ? '' : extractHash(window.location.href)
    )

    const replaceHash = useCallback(
        (newHash: string) => {
            const nextUrl = `${window.location.pathname}${window.location.search}#${newHash}`
            window.history.replaceState(null, '', nextUrl)
            setHash(newHash)
        },
        []
    )

    return [hash, replaceHash] as const
}
