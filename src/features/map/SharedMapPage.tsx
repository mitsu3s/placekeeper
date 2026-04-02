import { useState } from 'react'
import type { Place } from '@prisma/client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { BrandLink } from '@/components/branding/BrandLink'
import { PageMeta } from '@/components/seo/PageMeta'
import { SIGN_IN_ROUTE } from '@/config/app'
import { PlaceTable } from '@/features/places/components/PlaceTable'
import { useUrlHash } from '@/hooks/useUrlHash'
import type { Coordinate, LatLngTuple } from '@/lib/geo'
import { DEFAULT_MAP_CENTER, toLatLngTuple } from '@/lib/geo'
import { createPlaceHash } from '@/lib/hash'

const MapCanvas = dynamic(() => import('@/features/map/components/MapCanvas'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
})

export interface SharedMapPageProps {
    places: Place[]
}

export default function SharedMapPage({
    places,
}: SharedMapPageProps) {
    const [, setHash] = useUrlHash()
    const [centerPosition, setCenterPosition] = useState<LatLngTuple>(
        places[0] ? toLatLngTuple(places[0]) : DEFAULT_MAP_CENTER
    )
    const [routingPoints, setRoutingPoints] = useState<Coordinate[]>([])

    function focusPlace(placeName: string, latitude: number, longitude: number) {
        setCenterPosition([latitude, longitude])
        setHash(createPlaceHash(placeName))
    }

    return (
        <div className="bg-white flex min-h-screen w-full flex-col items-center">
            <PageMeta title="Share Map - Place Keeper" />
            <header className="mb-4 flex h-20 w-full items-center bg-white shadow-md">
                <div className="container mx-auto flex items-center justify-between px-6">
                    <BrandLink className="text-2xl md:text-3xl" />
                    <nav className="items-center text-lg text-black lg:flex">
                        <Link href={SIGN_IN_ROUTE} className="flex px-6 py-2 hover:text-gray-600">
                            Share your map too!
                        </Link>
                    </nav>
                </div>
            </header>
            <div className="w-full flex flex-col gap-4 px-1 md:flex-row">
                <div className="w-full overflow-auto transition-all duration-300 md:w-1/4 md:max-h-full">
                    <PlaceTable
                        places={places}
                        onPlaceSelect={(place) =>
                            focusPlace(place.name, place.latitude, place.longitude)
                        }
                        onRouteSelectionChange={setRoutingPoints}
                    />
                </div>
                <div className="w-full md:w-3/4">
                    <MapCanvas
                        places={places}
                        center={centerPosition}
                        routingPoints={routingPoints}
                    />
                </div>
            </div>
        </div>
    )
}
