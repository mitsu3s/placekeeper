import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const createRoutineMachineLayer = (props: any) => {
    const { routingPoints } = props
    const leafletWaypoints = routingPoints.map((routingPoint: any) =>
        L.latLng(routingPoint.latitude, routingPoint.longitude)
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
