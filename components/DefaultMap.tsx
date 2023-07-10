import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
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

const defaultLatitude = 34.95679345064951
const defaultLongitude = 137.159425710543

const DefaultMap = ({ buildings }: any) => {
    return (
        <MapContainer
            center={[defaultLatitude, defaultLongitude]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {buildings.map((building: any) => (
                <Marker key={building.id} position={[building.latitude, building.longitude]}>
                    <Popup>
                        {building.name} <br /> {building.description}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default DefaultMap
