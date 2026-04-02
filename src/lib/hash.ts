export function createPlaceHash(name: string) {
    return name.trim().replace(/\s+/g, '_')
}

export function extractHash(url: string) {
    return url.split('#')[1] ?? ''
}

