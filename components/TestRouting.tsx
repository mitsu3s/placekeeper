import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'

const createRoutineMachineLayer = (props: any) => {
    const instance = L.Routing.control({
        waypoints: [
            L.latLng(34.95592012311801, 137.13709831237796),
            L.latLng(34.95191028946883, 137.1674823760987),
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
