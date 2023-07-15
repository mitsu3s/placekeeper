import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import RoutingMachine from './TestRouting'

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})

const centerLatitude = 34.95475940197166
const centerLongitude = 137.15245841041596

const TestMap = () => {
    const waypoints = [
        { lat: 34.95592012311801, lng: 137.13709831237796 },
        { lat: 34.95191028946883, lng: 137.1674823760987 },
    ]
    return (
        <MapContainer
            center={[centerLatitude, centerLongitude]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '80vh', width: '80%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[centerLatitude, centerLongitude]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            {/* <RoutingMachine /> */}
            <RoutingMachine waypoints={waypoints} />
        </MapContainer>
    )
}

export default TestMap
