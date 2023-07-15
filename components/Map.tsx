import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useState, useEffect } from 'react'
import { iconLib } from '@/libs/Icon'
import location from '@/public/icons/location.svg'
import RoutingMachine from './Routing'

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})

// デフォルトマーカーの色違い
// const colorMarker = (color: string) => {
//     return new L.Icon({
//         iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
//         shadowUrl: markerShadow.src,
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//         popupAnchor: [1, -34],
//         shadowSize: [41, 41],
//     })
// }

// カスタムマーカー直接書く
const locationIcon = new L.Icon({
    iconUrl: location.src,
    iconRetinaUrl: location.src,
    iconAnchor: [17, 49],
    popupAnchor: [8, -40],
    iconSize: [35, 60],
})

const Map = ({ places, selectedPosition, onMapClick, center }: any) => {
    const [centerPosition, setCenterPosition] = useState<[number, number]>([0, 0])

    useEffect(() => {
        setCenterPosition(center)
    }, [center])

    const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
        if (centerPosition != center) {
            const map = useMap()
            map.setView(center, 15)
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

    return (
        <MapContainer
            center={centerPosition}
            zoom={15}
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
                        icon={locationIcon}
                    >
                        <Popup>
                            {place.name} <br /> {place.description}
                        </Popup>
                    </Marker>
                ))}

            {selectedPosition && <Marker position={selectedPosition}></Marker>}
            <MapClickHandler />
            <ChangeMapCenter center={center} />
            {/* <RoutingMachine /> */}
        </MapContainer>
    )
}

export default Map
