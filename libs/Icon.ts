import L from 'leaflet'
import marker from '@/public/icons/marker.svg'

const iconLib = new L.Icon({
    iconUrl: marker.src,
    iconRetinaUrl: marker.src,
    iconAnchor: [12, 42],
    popupAnchor: [8, -40],
    iconSize: [40, 70],
})

export { iconLib }
