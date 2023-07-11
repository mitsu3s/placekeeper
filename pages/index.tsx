import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FormValidationSchema = Yup.object().shape({
    placeName: Yup.string().required('Place Name is required'),
    description: Yup.string().required('Description is required'),
})

export const getServerSideProps = async () => {
    const places = await prisma.place.findMany()

    return {
        props: {
            places,
        },
    }
}

const MapPage = ({ places }: any) => {
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)

    const Map = React.useMemo(
        () =>
            dynamic(() => import('@/components/Map'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    const initialValues = {
        latitude: '',
        longitude: '',
        placeName: '',
        description: '',
    }

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedPosition([lat, lng])
    }

    const handleSubmit = async (values: any) => {
        values.latitude = selectedPosition ? selectedPosition[0] : ''
        values.longitude = selectedPosition ? selectedPosition[1] : ''

        try {
            const response = await axios.post('/api/place', values)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen">
            <Map places={places} selectedPosition={selectedPosition} onMapClick={handleMapClick} />
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
                            id="latitude"
                            name="latitude"
                            value={selectedPosition ? selectedPosition[0] : ''}
                            className="text-black"
                            readOnly
                        />
                        <ErrorMessage name="latitude" component="div" className="text-red-500" />
                    </div>
                    <div className=" text-black">
                        <label htmlFor="longitude" className="text-black">
                            Longitude:
                        </label>
                        <Field
                            type="text"
                            id="longitude"
                            name="longitude"
                            value={selectedPosition ? selectedPosition[1] : ''}
                            className="text-black"
                            readOnly
                        />
                        <ErrorMessage name="longitude" component="div" className="text-red-500" />
                    </div>
                    <div className="mt-4 text-black">
                        <label htmlFor="placeName" className="text-black">
                            Place Name:
                        </label>
                        <Field type="text" id="placeName" name="placeName" className="text-black" />
                        <ErrorMessage name="placeName" component="div" className="text-red-500" />
                    </div>
                    <div className="mt-2 text-black">
                        <label htmlFor="description" className="text-black">
                            Description:
                        </label>
                        <Field
                            type="text"
                            id="description"
                            name="description"
                            className="text-black"
                        />
                        <ErrorMessage name="description" component="div" className="text-red-500" />
                    </div>
                    <div>
                        <button type="submit" className="bg-slate-300 text-black mt-4 px-4 rounded">
                            Submit
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default MapPage
