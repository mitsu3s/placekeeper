import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { PrismaClient } from '@prisma/client'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useHash } from '@/libs/useHash'
import { useSession, signIn, signOut, getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import generateShareCode from '@/utils/shareCodeGenerator'
import PlaceTable from '@/components/PlaceTable'

const prisma = new PrismaClient()

interface Place {
    id: string
    latitude: number
    longitude: number
    name: string
    description: string
    userId: string
}

const FormValidationSchema = Yup.object().shape({
    placeName: Yup.string().required('Place Name is required'),
    description: Yup.string().required('Description is required'),
})

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context)

    if (!session) {
        return {
            props: {},
        }
    }

    const places = await prisma.place.findMany()

    return {
        props: {
            places,
        },
    }
}

const centerLatitude = 34.95475940197166
const centerLongitude = 137.15245841041596

const MapPage = ({ places }: { places: Place[] }) => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [hash, setHash] = useHash()
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)
    const [centerPosition, setCenterPosition] = useState<[number, number]>([
        centerLatitude,
        centerLongitude,
    ])
    const [shareCode, setShareCode] = useState('')

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

    const handlePlaceClick = (placeName: string, lat: number, lng: number) => {
        setCenterPosition([lat, lng])
        setHash(formatPlaceNameForHash(placeName))
    }

    const handleGenerateShareCode = () => {
        const newShareCode = generateShareCode(10)
        setShareCode(newShareCode)
    }

    const handleSubmit = async (values: any) => {
        values.latitude = selectedPosition ? selectedPosition[0] : ''
        values.longitude = selectedPosition ? selectedPosition[1] : ''

        try {
            if (session) {
                values.userId = session.user.id
                const response = await axios.post('/api/place', values)
                console.log(response)
                router.reload()
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
            router.push('/')
        }
    }

    const formatPlaceNameForHash = (placeName: string) => {
        return placeName.replace(/\s/g, '_')
    }

    return (
        <div className="bg-white flex flex-col items-center justify-center">
            <div className="my-2"></div>
            <div className="w-full flex justify-start">
                <PlaceTable
                    places={places}
                    formatPlaceNameForHash={formatPlaceNameForHash}
                    handlePlaceClick={handlePlaceClick}
                />
                <Map
                    places={places}
                    selectedPosition={selectedPosition}
                    onMapClick={handleMapClick}
                    center={centerPosition}
                    className="z-100"
                />
            </div>
            <div>
                {shareCode && (
                    <div className="text-black mt-4">
                        <p>共有コード:</p>
                        <a href={shareCode} target="_blank" rel="noopener noreferrer">
                            {shareCode}
                        </a>
                    </div>
                )}
                <button
                    onClick={handleGenerateShareCode}
                    className="bg-slate-300 text-black mt-4 px-4 rounded"
                    disabled={!!shareCode}
                >
                    {shareCode ? 'Save Share Code' : 'Generate Share Code'}
                </button>
            </div>
            <div className="flex">
                <div className="pl-4">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={FormValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form className="mt-4">
                            <div className="text-black">
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
                                <ErrorMessage
                                    name="latitude"
                                    component="div"
                                    className="text-red-500"
                                />
                            </div>
                            <div className="text-black">
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
                                    id="placeName"
                                    name="placeName"
                                    className="text-black"
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
                                    id="description"
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
                </div>
            </div>
        </div>
    )
}

export default MapPage
