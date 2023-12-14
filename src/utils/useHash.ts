import { useCallback } from 'react'
import { useRouter } from 'next/router'

export const useHash = (): [string, (newHash: string) => void] => {
    const router = useRouter()
    const hash = extractHash(router.asPath)
    const setHash = useCallback((newHash: string) => {
        router.replace({ hash: newHash }, undefined, { shallow: true })
    }, [])
    return [hash, setHash]
}

const extractHash = (url: string): string => {
    return url.split('#')[1] ?? ''
}
