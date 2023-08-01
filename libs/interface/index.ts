import { Place } from '@prisma/client'

export interface PlaceMapProps {
    places: Place[]
    shareId: string
}

export interface ShareMapProps {
    places: Place[]
}
