import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const FormValidationSchema = () => {}

const MapPage = () => {
    const [formMarkerPosition, setFormMarkerPosition] = useState<[number, number] | null>(null)

    const Map = React.useMemo(
        () =>
            dynamic(() => import('@/components/Map'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    const handleMarkerPositionUpdate = (newPosition: [number, number]) => {
        setFormMarkerPosition(newPosition)
    }

    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen">
            <Map onMarkerPositionUpdate={handleMarkerPositionUpdate} />

            {formMarkerPosition && (
                <div className="mt-4 text-black">
                    <label htmlFor="latitude">Latitude:</label>
                    <input id="latitude" type="text" value={formMarkerPosition[0]} readOnly />
                    <br />
                    <label htmlFor="longitude">Longitude:</label>
                    <input id="longitude" type="text" value={formMarkerPosition[1]} readOnly />
                </div>
            )}
        </div>
    )
}

export default MapPage
