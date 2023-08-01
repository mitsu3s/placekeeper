import { Place } from '@prisma/client'

export interface MapProps {
    places: Place[]
    shareId: string
}

export interface ShareMapProps {
    places: Place[]
}
