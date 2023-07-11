import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})

const defaultLatitude = 34.95475940197166
const defaultLongitude = 137.15245841041596

const Map = ({ places, selectedPosition, onMapClick }: any) => {
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
            center={[defaultLatitude, defaultLongitude]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '80vh', width: '80%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places.map((building: any) => (
                <Marker key={building.id} position={[building.latitude, building.longitude]}>
                    <Popup>
                        {building.name} <br /> {building.description}
                    </Popup>
                </Marker>
            ))}
            {selectedPosition && <Marker position={selectedPosition}></Marker>}
            <MapClickHandler />
        </MapContainer>
    )
}

export default Map
