import { useState, useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})

interface MapProps {
    onMarkerPositionUpdate: (newPosition: [number, number]) => void
}

const Map: React.FC<MapProps> = ({ onMarkerPositionUpdate }) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>([
        34.95679345064951, 137.159425710543,
    ])

    const handleClick = (e: any) => {
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
                    Tokyo Mid Town. <br /> Easily customizable.
                </Popup>
            </Marker>
        )
    }

    return (
        <MapContainer
            center={[34.95679345064951, 137.159425710543]}
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
