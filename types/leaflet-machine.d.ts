import * as L from 'leaflet'

declare module 'leaflet' {
    namespace Routing {
        interface RoutingControlOptions extends ItineraryOptions {
            draggableWaypoints?: boolean | undefined
        }
    }
}
