import { useCallback } from 'react'
import { useRouter } from 'next/router'

export function useHash(): [string, (newHash: string) => void] {
    const router = useRouter()
    const hash = extractHash(router.asPath)
    const setHash = useCallback((newHash: string) => {
        // ブラウザの履歴に残すなら、ここを router.push に変えれば OK
        router.replace({ hash: newHash }, undefined, { shallow: true })
    }, [])
    return [hash, setHash]
}

// URL の # 以降の文字列を取り出すユーティリティ
function extractHash(url: string): string {
    return url.split('#')[1] ?? ''
}
