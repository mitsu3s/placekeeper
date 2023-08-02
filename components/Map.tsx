import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useState, useEffect } from 'react'
import marker from '@/public/icons/marker.svg'
import RoutingMachine from './Routing'
import { RoutingPoint } from '@/libs/interface/type'

L.Icon.Default.mergeOptions({
    shadowUrl: markerShadow.src,
    iconUrl: marker.src,
    iconRetinaUrl: marker.src,
    iconAnchor: [9, 52],
    popupAnchor: [8, -40],
    iconSize: [35, 60],
})

const Map = ({ places, selectedPosition, onMapClick, center, waypoints }: any) => {
    const [centerPosition, setCenterPosition] = useState<[number, number]>([0, 0])
    const [selectedWaypoints, setselectedWaypoints] = useState<RoutingPoint[]>([])

    useEffect(() => {
        if (selectedWaypoints.length > 0) {
            if (selectedWaypoints.length == waypoints.length) {
                let isSame = true
                for (let i = 0; i < waypoints.length; i++) {
                    if (
                        waypoints[i].latitude != selectedWaypoints[i].latitude ||
                        waypoints[i].longitude != selectedWaypoints[i].longitude
                    ) {
                        isSame = false
                    }
                }
                if (!isSame) {
                    setselectedWaypoints(waypoints)
                }
            } else {
                setselectedWaypoints(waypoints)
            }
        } else {
            setselectedWaypoints(waypoints)
        }
    }, [waypoints])

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
        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng || {}
                if (lat && lng) {
                    onMapClick(lat, lng)
                }
            },
        })
        return null
    }

    const routingComponent =
        selectedWaypoints.length > 1 ? <RoutingMachine waypoints={selectedWaypoints} /> : null

    return (
        <MapContainer
            center={centerPosition}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '80vh', width: '80%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places &&
                places.length > 0 &&
                places.map((place: any) => (
                    <Marker
                        key={place.id}
                        position={[place.latitude, place.longitude]}
                        // icon={locationIcon}
                    >
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
