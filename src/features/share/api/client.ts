import { fetchJson } from '@/lib/fetch-json'

interface SaveShareCodeResponse {
    shareId: string
}

export async function saveShareCodeRequest(shareCode: string) {
    return fetchJson<SaveShareCodeResponse>('/api/shares', {
        method: 'POST',
        body: JSON.stringify({ shareCode }),
    })
}
