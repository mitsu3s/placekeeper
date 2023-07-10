import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { GetServerSideProps, NextPage } from 'next'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface FormValues {
    latitude: number
    longitude: number
    buildingName: string
}

const FormValidationSchema = Yup.object().shape({
    buildingName: Yup.string().required('Building Name is required'),
})

export const getServerSideProps = async () => {
    const buildings = await prisma.building.findMany()
    console.log(buildings)

    return {
        props: {
            buildings,
        },
    }
}

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
            <Map onMarkerPositionUpdate={handleMarkerPositionUpdate} />

            {formMarkerPosition && (
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
                                name="latitude"
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
                                name="longitude"
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
                        <div className="mt-4 text-black">
                            <label htmlFor="buildingName" className="text-black">
                                Building Name:
                            </label>
                            <Field
                                id="buildingName"
                                type="text"
                                name="buildingName"
                                className="text-black"
                            />
                            <ErrorMessage
                                name="buildingName"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mt-4 text-black">
                            <label htmlFor="description" className="text-black">
                                Description:
                            </label>
                            <Field
                                id="description"
                                type="text"
                                name="description"
                                className="text-black"
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
