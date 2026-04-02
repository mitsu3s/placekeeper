export interface Coordinate {
    latitude: number
    longitude: number
}

export type LatLngTuple = [number, number]

export const DEFAULT_MAP_CENTER: LatLngTuple = [35.17096778816617, 136.8829223456777]

export function toLatLngTuple({ latitude, longitude }: Coordinate): LatLngTuple {
    return [latitude, longitude]
}

export function coordinatesMatch(left: Coordinate, right: Coordinate) {
    return left.latitude === right.latitude && left.longitude === right.longitude
}

export function toCoordinateKey({ latitude, longitude }: Coordinate) {
    return `${latitude}:${longitude}`
}

