import { Place } from '@prisma/client'

export interface MapProps {
    places: Place[]
    shareId: string
}

export interface ShareMapProps {
    places: Place[]
}

export interface PlaceTableProps {
    places: Place[]
    handlePlaceClick: (placeName: string, lat: number, lng: number) => void
    updateWaypoints: (selectedPlaces: any) => void
    canDelete: boolean
}
