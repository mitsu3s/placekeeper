import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface FormValues {
    latitude: number
    longitude: number
    buildingName: string
}

const FormValidationSchema = Yup.object().shape({
    buildingName: Yup.string().required('Building Name is required'),
    description: Yup.string().required('Description is required'),
})

export const getServerSideProps = async () => {
    const buildings = await prisma.place.findMany()
    console.log(buildings)

    return {
        props: {
            buildings,
        },
    }
}

const MapPage = ({ buildings }: any) => {
    const [formMarkerPosition, setFormMarkerPosition] = useState<[number, number] | null>(null)
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)

    const Map = React.useMemo(
        () =>
            dynamic(() => import('@/components/Map'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedPosition([lat, lng])
    }

    const handleMarkerPositionUpdate = (newPosition: [number, number]) => {
        setFormMarkerPosition(newPosition)
    }

    const handleSubmit = async (values: FormValues) => {
        const latitude = formMarkerPosition ? formMarkerPosition[0] : 0
        const longitude = formMarkerPosition ? formMarkerPosition[1] : 0

        const updatedValues = {
            ...values,
            latitude,
            longitude,
        }

        console.log('Before send', updatedValues)
        try {
            const response = await axios.post('/api/send', updatedValues)
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    const initialValues = React.useMemo(
        () => ({
            latitude: formMarkerPosition ? formMarkerPosition[0] : 0,
            longitude: formMarkerPosition ? formMarkerPosition[1] : 0,
            buildingName: '',
            description: '',
        }),
        [formMarkerPosition]
    )

    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen">
            <Map places={buildings} selectedPosition={selectedPosition} onMapClick={handleMapClick}>
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
                                type="text"
                                name="latitude"
                                value={selectedPosition ? selectedPosition[0] : ''}
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
                                type="text"
                                name="longitude"
                                value={selectedPosition ? selectedPosition[1] : ''}
                                className="text-black"
                                readOnly
                            />
                            <ErrorMessage
                                name="longitude"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mt-4 text-black">
                            <label htmlFor="placeName" className="text-black">
                                Place Name:
                            </label>
                            <Field
                                type="text"
                                name="placeName"
                                className="text-black"
                                placeholder="Place Name"
                            />
                            <ErrorMessage
                                name="placeName"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mt-2 text-black">
                            <label htmlFor="description" className="text-black">
                                Description:
                            </label>
                            <Field
                                type="text"
                                name="description"
                                className="text-black"
                                placeholder="Description"
                            />
                            <ErrorMessage
                                name="description"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                            >
                                Submit
                            </button>
                        </div>
                    </Form>
                </Formik>
            </Map>
        </div>
    )
}

export default MapPage
