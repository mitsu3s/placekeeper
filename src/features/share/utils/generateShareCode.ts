const SHARE_CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function generateShareCode(length: number) {
    let result = ''

    for (let index = 0; index < length; index += 1) {
        const randomIndex = Math.floor(Math.random() * SHARE_CODE_ALPHABET.length)
        result += SHARE_CODE_ALPHABET[randomIndex]
    }

    return result
}

