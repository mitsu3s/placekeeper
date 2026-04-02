import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { extractHash } from '@/lib/hash'

export function useUrlHash(): readonly [string, (newHash: string) => void] {
    const router = useRouter()
    const hash = extractHash(router.asPath)

    const setHash = useCallback(
        (newHash: string) => {
            const [pathWithoutHash] = router.asPath.split('#')
            void router.replace(`${pathWithoutHash}#${newHash}`, undefined, {
                shallow: true,
                scroll: false,
            })
        },
        [router]
    )

    return [hash, setHash] as const
}

