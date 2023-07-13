import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useState, useEffect } from 'react'
import { iconPerson } from './Icon'
import location from './icons/location.svg'

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})

const colorMarker = (color: string) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: markerShadow.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    })
}

const svgIcon = L.Icon.extend({
    html: `<svg height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 293.33 293.33" xml:space="preserve" fill="#c464bc" stroke="#c464bc" stroke-width="4.40001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="1.1733360000000002"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path style="fill:#cf8ee6;" d="M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878 c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212 c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084 c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358 c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307 C198.98,120.938,175.559,144.358,146.667,144.358z"></path> <circle style="fill:#cf8ee6;" cx="146.667" cy="90.196" r="21.756"></circle> </g> </g> </g></svg>`,
})

const locationIcon = new L.Icon({
    iconUrl: location.src,
    iconRetinaUrl: location.src,
    iconAnchor: [12, 42],
    popupAnchor: [8, -40],
    iconSize: [25, 55],
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
            {places.map((place: any) => (
                <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                    // icon={colorMarker('red')}
                    // icon={svgIcon}
                    // icon={new subIcon()}
                    // icon={iconPerson}
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
        </MapContainer>
    )
}

export default Map
