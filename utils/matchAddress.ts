export const matchAddress = (address: string, apiData: any) => {
    let matchingCoordinates: number[] = []
    let maxMatchingCount = 0

    for (const item of apiData) {
        const title = item.properties.title
        const matchingCount = title.split('').reduce((count: any, char: any, index: any) => {
            return count + (char === address[index] ? 1 : 0)
        }, 0)

        if (matchingCount > maxMatchingCount) {
            maxMatchingCount = matchingCount
            matchingCoordinates = item.geometry.coordinates
        }
    }

    return matchingCoordinates
}
