import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { Place } from '@prisma/client'
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMapEvents,
    useMap,
    ZoomControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapProps } from '@/libs/interface/props'
import { RoutingPoint } from '@/libs/interface/type'
import { RoutingMachine } from '@/components/Routing'
import { Search } from '@/components/Search'
import styles from '@/styles/leaflet.module.css'
import marker from '@/../public/icons/marker.svg'
import shadow from '@/../public/images/shadow.png'

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

L.Icon.Default.mergeOptions({
    shadowUrl: shadow.src,
    iconUrl: marker.src,
    iconRetinaUrl: marker.src,
    iconAnchor: [9, 52],
    popupAnchor: [8, -40],
    iconSize: [35, 60],
})

const Map: NextPage<MapProps> = ({
    places,
    selectedPosition,
    handleMapClick,
    handleSearchClick,
    center,
    routingPoints,
}) => {
    const [centerPosition, setCenterPosition] = useState<[number, number]>([0, 0])
    const [selectedRoutingPoints, setSelectedRoutingPoints] = useState<RoutingPoint[]>([])
    const [enableMapClick, setEnableMapClick] = useState<boolean>(true)

    useEffect(() => {
        if (selectedRoutingPoints.length > 0) {
            if (selectedRoutingPoints.length == routingPoints.length) {
                let isSame = true
                for (let i = 0; i < routingPoints.length; i++) {
                    if (
                        routingPoints[i].latitude != selectedRoutingPoints[i].latitude ||
                        routingPoints[i].longitude != selectedRoutingPoints[i].longitude
                    ) {
                        isSame = false
                    }
                }
                if (!isSame) {
                    setSelectedRoutingPoints(routingPoints)
                }
            } else {
                setSelectedRoutingPoints(routingPoints)
            }
        } else {
            setSelectedRoutingPoints(routingPoints)
        }
    }, [routingPoints])

    useEffect(() => {
        setCenterPosition(center)
    }, [center])

    const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
        if (centerPosition != center) {
            const map = useMap()
            map.setView(center, 14)
        }
        return null
    }

    const MapClickHandler = () => {
        if (!enableMapClick) {
            return null
        }
        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng || {}
                if (lat && lng) {
                    handleMapClick(lat, lng)
                }
            },
        })
        return null
    }

    const invalidClick = () => {
        setEnableMapClick(false)
    }

    const validClick = () => {
        setEnableMapClick(true)
    }

    const handleSearch = (placeName: string, latitude: number, longitude: number) => {
        handleSearchClick(placeName, latitude, longitude)
    }

    const SearchComponent = () => {
        const positionClass = POSITION_CLASSES.topleft
        return (
            <div className={positionClass}>
                <div
                    className="leaflet-control leaflet-bar"
                    onMouseEnter={invalidClick}
                    onMouseLeave={validClick}
                >
                    <Search handleSearch={handleSearch} />
                </div>
            </div>
        )
    }

    const routingComponent =
        selectedRoutingPoints.length > 1 ? (
            <RoutingMachine routingPoints={selectedRoutingPoints} />
        ) : null

    return (
        <MapContainer
            center={centerPosition}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '80vh', width: '80%' }}
            zoomControl={false}
            className={styles.leafletContainer}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            <SearchComponent />
            {places &&
                places.length > 0 &&
                places.map((place: Place) => (
                    <Marker key={place.id} position={[place.latitude, place.longitude]}>
                        <Popup>
                            {place.name} <br /> {place.description}
                        </Popup>
                    </Marker>
                ))}

            {selectedPosition && <Marker position={selectedPosition}></Marker>}
            <MapClickHandler />
            <ChangeMapCenter center={center} />
            {routingComponent}
        </MapContainer>
    )
}

export default Map
