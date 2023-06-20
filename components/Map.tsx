import { useState, useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// delete L.Icon.Default.prototype._getIconUrl

const latitude = 34.95679345064951
const longitude = 137.159425710543

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})

interface MapProps {
    onMarkerPositionUpdate: (newPosition: [number, number]) => void
}

const Map: React.FC<MapProps> = ({ onMarkerPositionUpdate }) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>([latitude, longitude])

    const handleClick = (e: L.LeafletMouseEvent) => {
        const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng]
        console.log('Clicked position:', newPosition)
        setMarkerPosition(newPosition)
    }

    useEffect(() => {
        onMarkerPositionUpdate(markerPosition)
    }, [markerPosition, onMarkerPositionUpdate])

    const LocationMarker = () => {
        useMapEvents({
            click: handleClick,
        })

        return markerPosition === null ? null : (
            <Marker position={markerPosition}>
                <Popup>
                    Marker Content. <br /> Description etc...
                </Popup>
            </Marker>
        )
    }

    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '80vh', width: '80%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    )
}

export default Map
