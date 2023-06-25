import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'

const FormValidationSchema = Yup.object().shape({})

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

    const handleSubmit = async () => {}

    const initialValues = {}

    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen">
            <Map onMarkerPositionUpdate={handleMarkerPositionUpdate} />

            {formMarkerPosition && (
                // <div className="mt-4 text-black">
                //     <label htmlFor="latitude">Latitude:</label>
                //     <input id="latitude" type="text" value={formMarkerPosition[0]} readOnly />
                //     <br />
                //     <label htmlFor="longitude">Longitude:</label>
                //     <input id="longitude" type="text" value={formMarkerPosition[1]} readOnly />
                // </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={FormValidationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="mt-4 text-black">
                            <label htmlFor="latitude" className="text-black">
                                Latitude:
                            </label>
                            <Field
                                id="latitude"
                                type="text"
                                value={formMarkerPosition[0]}
                                className="text-black"
                                readOnly
                            />
                            <ErrorMessage
                                name="latitude"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className=" text-black">
                            <label htmlFor="longitude" className="text-black">
                                Longitude:
                            </label>
                            <Field
                                id="longitude"
                                type="text"
                                value={formMarkerPosition[1]}
                                className="text-black"
                                readOnly
                            />
                            <ErrorMessage
                                name="longitude"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-slate-300 text-black mt-4 px-4 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </Form>
                </Formik>
            )}
        </div>
    )
}

export default MapPage
