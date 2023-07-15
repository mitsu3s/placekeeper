## PlaceKeeper

Location sharing application (planned)

## Requirement

-   TypeScript 4.9.5
-   Next.js 13.4.6
-   I just wrote it down for now, so there will be more.

## References

Marker Color

```
https://github.com/pointhi/leaflet-color-markers
```

## Attention

Type specification for /components/Routing.tsx
May cause errors due to insufficient validation.

```
interface RoutingControlOptions extends ItineraryOptions {
    + draggableWaypoints?: boolean | undefined;
}
```
