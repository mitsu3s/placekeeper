import { randomBytes } from 'crypto'

const generateShareCode = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    const randomBytesLength = Math.ceil((length * 6) / 8)
    const bytes = randomBytes(randomBytesLength)
    let result = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = bytes[i] % charactersLength
        result += characters.charAt(randomIndex)
    }

    return result
}

export default generateShareCode
