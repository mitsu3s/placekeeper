import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const createRoutineMachineLayer = (props: any) => {
    console.log(props)
    const instance = L.Routing.control({
        waypoints: [
            L.latLng(35.71498168439901, 139.79663181249592),
            L.latLng(35.71020351730888, 139.81066512955994),
        ],
        lineOptions: {
            styles: [
                {
                    color: 'blue',
                    opacity: 0.6,
                    weight: 4,
                },
            ],
            extendToWaypoints: true,
            missingRouteTolerance: 1,
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        draggableWaypoints: false,
    })
    return instance
}

const RoutingMachine = createControlComponent(createRoutineMachineLayer)

export default RoutingMachine
