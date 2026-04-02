export interface PlaceItem {
    id: string
    name: string
    description: string
    latitude: number
    longitude: number
}

export interface CreatePlaceFormValues {
    name: string
    description: string
}
