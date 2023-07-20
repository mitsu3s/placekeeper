import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const createRoutineMachineLayer = (props: any) => {
    const { waypoints } = props
    const leafletWaypoints = waypoints.map((waypoint: any) =>
        L.latLng(waypoint.latitude, waypoint.longitude)
    )

    const instance = L.Routing.control({
        waypoints: leafletWaypoints,
        lineOptions: {
            styles: [
                {
                    color: '#6366f1',
                    opacity: 0.9,
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
