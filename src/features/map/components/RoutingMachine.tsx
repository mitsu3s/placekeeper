import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import type { Coordinate } from '@/lib/geo'

interface RoutingMachineProps {
    routingPoints: Coordinate[]
    position?: L.ControlPosition
}

function createRoutingMachineLayer({ routingPoints }: RoutingMachineProps) {
    return L.Routing.control({
        waypoints: routingPoints.map((routingPoint) =>
            L.latLng(routingPoint.latitude, routingPoint.longitude)
        ),
        lineOptions: {
            styles: [
                {
                    color: '#000000',
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
}

export const RoutingMachine = createControlComponent<L.Control, RoutingMachineProps>(
    createRoutingMachineLayer
)
