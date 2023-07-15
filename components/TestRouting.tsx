import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'

const createRoutineMachineLayer = (props: any) => {
    const { waypoints } = props
    const leafletWaypoints = waypoints.map((waypoint: any) => L.latLng(waypoint.lat, waypoint.lng))

    const instance = L.Routing.control({
        waypoints: leafletWaypoints,
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
