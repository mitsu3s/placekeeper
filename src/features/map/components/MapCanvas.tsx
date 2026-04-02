import { useEffect } from 'react'
import type { Place } from '@prisma/client'
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
    ZoomControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { AddressSearchControl } from '@/features/map/components/AddressSearchControl'
import { RoutingMachine } from '@/features/map/components/RoutingMachine'
import styles from '@/features/map/components/MapCanvas.module.css'
import type { Coordinate, LatLngTuple } from '@/lib/geo'
import { toCoordinateKey } from '@/lib/geo'

let hasConfiguredLeafletIcon = false

function configureLeafletIcon() {
    if (hasConfiguredLeafletIcon) {
        return
    }

    L.Icon.Default.mergeOptions({
        shadowUrl: '/images/shadow.png',
        iconUrl: '/icons/marker.svg',
        iconRetinaUrl: '/icons/marker.svg',
        iconAnchor: [9, 52],
        popupAnchor: [5.5, -41.5],
        iconSize: [28, 53],
    })

    hasConfiguredLeafletIcon = true
}

configureLeafletIcon()

interface AddressSelection extends Coordinate {
    label: string
}

interface MapCanvasProps {
    places: Place[]
    center: LatLngTuple
    routingPoints: Coordinate[]
    selectedPosition?: LatLngTuple | null
    onMapSelect?: (coordinate: Coordinate) => void
    onAddressSelect?: (selection: AddressSelection) => void
}

function MapViewportController({ center }: { center: LatLngTuple }) {
    const map = useMap()

    useEffect(() => {
        map.setView(center, 14)
    }, [center, map])

    return null
}

function MapClickHandler({
    onMapSelect,
}: {
    onMapSelect: (coordinate: Coordinate) => void
}) {
    useMapEvents({
        click(event) {
            onMapSelect({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            })
        },
    })

    return null
}

export default function MapCanvas({
    places,
    center,
    routingPoints,
    selectedPosition = null,
    onMapSelect,
    onAddressSelect,
}: MapCanvasProps) {
    const routingKey = routingPoints.map(toCoordinateKey).join('|')

    return (
        <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '90vh', width: '100%' }}
            zoomControl={false}
            className={styles.mapCanvas}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            {onAddressSelect ? <AddressSearchControl onSearch={onAddressSelect} /> : null}
            {places.map((place) => (
                <Marker key={place.id} position={[place.latitude, place.longitude]}>
                    <Popup>
                        {place.name} <br /> {place.description}
                    </Popup>
                </Marker>
            ))}
            {selectedPosition ? <Marker position={selectedPosition} /> : null}
            {onMapSelect ? <MapClickHandler onMapSelect={onMapSelect} /> : null}
            <MapViewportController center={center} />
            {routingPoints.length > 1 ? (
                <RoutingMachine key={routingKey} routingPoints={routingPoints} />
            ) : null}
        </MapContainer>
    )
}

