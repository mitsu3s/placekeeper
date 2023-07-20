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
import Link from 'next/link'

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

    const places = await prisma.place.findMany({
        where: {
            userId: session.user.id,
        },
    })
    const share = await prisma.share.findUnique({
        where: {
            userId: session.user.id,
        },
    })

    const shareCode = share?.shareId || ''

    return {
        props: {
            places,
            shareId: shareCode,
        },
    }
}

const centerLatitude = 34.95475940197166
const centerLongitude = 137.15245841041596

const MapPage = ({ places, shareId }: any) => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [hash, setHash] = useHash()
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)
    const [centerPosition, setCenterPosition] = useState<[number, number]>([
        places.length > 0 ? places[0].latitude : centerLatitude,
        places.length > 0 ? places[0].longitude : centerLongitude,
    ])
    const [shareCode, setShareCode] = useState(shareId)
    const [waypoints, setWaypoints] = useState<string[]>([])

    const updateWaypoints = (selectedPlaces: any) => {
        const selectedWaypoints = selectedPlaces.map((place: any) => ({
            latitude: place.latitude,
            longitude: place.longitude,
        }))
        setWaypoints(selectedWaypoints)
    }

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

    const handleGenerateShareCode = async () => {
        if (session) {
            try {
                const newShareCode = generateShareCode(10)
                setShareCode(newShareCode)
                const res = await axios.post('/api/share/create', {
                    shareCode: newShareCode,
                    userId: session.user.id,
                })
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        } else {
            router.push('/')
        }
    }

    const handleCreate = async (values: any) => {
        values.latitude = selectedPosition ? selectedPosition[0] : ''
        values.longitude = selectedPosition ? selectedPosition[1] : ''

        if (session) {
            try {
                values.userId = session.user.id
                const res = await axios.post('/api/place/create', values)
                console.log(res)
                router.reload()
            } catch (error) {
                console.log(error)
                router.push('/')
            }
        } else {
            router.push('/')
        }
    }

    const formatPlaceNameForHash = (placeName: string) => {
        return placeName.replace(/\s/g, '_')
    }

    return (
        <div className="bg-white flex flex-col items-center justify-center">
            <header className="z-30 flex items-center w-full h-20 sm:h-16 bg-indigo-500 mb-4">
                <div className="container flex items-center justify-between px-6 mx-auto">
                    <Link
                        href="/"
                        className="text-lg sm:text-xl font-black uppercase text-white md:text-2xl"
                    >
                        Place Keeper
                    </Link>
                    <div className="flex items-center">
                        <nav className="text-md items-center md:text-base lg:text-lg font-sen text-white lg:flex">
                            {shareCode && (
                                <div className="text-white pr-6 lg:py-2">
                                    ShareCode: {shareCode}
                                </div>
                            )}
                            {!shareCode && (
                                <button
                                    onClick={handleGenerateShareCode}
                                    className="text-white pr-6 lg:py-2"
                                >
                                    Generate Share Code
                                </button>
                            )}
                            <button
                                className="px-6 py-2"
                                onClick={() =>
                                    signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL })
                                }
                            >
                                Sign out
                            </button>
                        </nav>
                    </div>
                </div>
            </header>
            <div className="w-full flex justify-start px-1">
                <PlaceTable
                    places={places}
                    formatPlaceNameForHash={formatPlaceNameForHash}
                    handlePlaceClick={handlePlaceClick}
                    updateWaypoints={updateWaypoints}
                />
                <Map
                    places={places}
                    selectedPosition={selectedPosition}
                    onMapClick={handleMapClick}
                    center={centerPosition}
                    waypoints={waypoints}
                />
            </div>
            <div className="mt-4">
                <Formik
                    initialValues={initialValues}
                    validationSchema={FormValidationSchema}
                    onSubmit={handleCreate}
                >
                    <Form className="flex">
                        <div className="">
                            <label htmlFor="latitude" className="text-gray-400">
                                Latitude:
                            </label>
                            <Field
                                type="text"
                                id="latitude"
                                name="latitude"
                                value={selectedPosition ? selectedPosition[0] : ''}
                                className="text-gray-400"
                                readOnly
                            />
                            <ErrorMessage
                                name="latitude"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="longitude" className="text-gray-400">
                                Longitude:
                            </label>
                            <Field
                                type="text"
                                id="longitude"
                                name="longitude"
                                value={selectedPosition ? selectedPosition[1] : ''}
                                className="text-gray-400"
                                readOnly
                            />
                            <ErrorMessage
                                name="longitude"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="text-black">
                            <label htmlFor="placeName" className="text-black">
                                Place Name:
                            </label>
                            <Field
                                type="text"
                                id="placeName"
                                name="placeName"
                                className="text-black"
                                autoComplete="off"
                            />
                            <ErrorMessage
                                name="placeName"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="text-black">
                            <label htmlFor="description" className="text-black">
                                Description:
                            </label>
                            <Field
                                type="text"
                                id="description"
                                name="description"
                                className="text-black"
                                autoComplete="off"
                            />
                            <ErrorMessage
                                name="description"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div>
                            <button type="submit" className="bg-slate-300 text-black px-4 rounded">
                                Submit
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default MapPage
