import { Place } from '@prisma/client'
import { PlaceCoordinate } from './place'

export interface MapProps {
    places: Place[]
    shareId: string
}

export interface ShareMapProps {
    places: Place[]
}

export interface PlaceTableProps {
    places: Place[]
    handlePlaceClick: (placeName: string, latitude: number, longitude: number) => void
    updateWaypoints: (selectedRoutingpoints: PlaceCoordinate[]) => void
    canDelete: boolean
}
