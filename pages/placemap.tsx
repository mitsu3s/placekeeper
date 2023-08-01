import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useHash } from '@/utils/useHash'
import { useSession, signOut, getSession } from 'next-auth/react'
import generateShareCode from '@/utils/shareCodeGenerator'
import PlaceTable from '@/components/PlaceTable'
import Link from 'next/link'
import forHash from '@/utils/replaceSpace'
import { getPlaces } from '@/handlers/place/get'
import { getShareId } from '@/handlers/share/get'
import { MapProps } from '@/libs/interface/props'
import { MapFormSchema } from '@/libs/validation/form'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const places = await getPlaces(session.user.id)
    const shareId = await getShareId(session.user.id)

    return {
        props: {
            places,
            shareId,
        },
    }
}

const centerLatitude = 35.17096778816617
const centerLongitude = 136.8829223456777

const MapPage = ({ places, shareId }: MapProps) => {
    const { data: session } = useSession()
    const router = useRouter()
    const [, setHash] = useHash()
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
        setHash(forHash(placeName))
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

    return (
        <div className="bg-white flex flex-col items-center h-screen">
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
                                    className="text-white pr-6 lg:py-2 hover:text-gray-300"
                                >
                                    Generate Share Code
                                </button>
                            )}
                            <button
                                className="px-6 py-2 uppercase hover:text-gray-300"
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
                    handlePlaceClick={handlePlaceClick}
                    updateWaypoints={updateWaypoints}
                    canDelete={true}
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
                    validationSchema={MapFormSchema}
                    onSubmit={handleCreate}
                >
                    <Form className="flex bg-white">
                        <div className="text-gray-800 ml-6">
                            <label htmlFor="placeName" className="text-gray-800">
                                Place Name:{' '}
                            </label>
                            <Field
                                type="text"
                                id="placeName"
                                name="placeName"
                                className="text-gray-800 w-36 rounded-sm outline-none ring-indigo-300 transition duration-100 focus-visible:ring bg-slate-100"
                                autoComplete="off"
                            />
                            <ErrorMessage
                                name="placeName"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="text-gray-800 ml-2">
                            <label htmlFor="description" className="text-gray-800">
                                Description:{' '}
                            </label>
                            <Field
                                type="text"
                                id="description"
                                name="description"
                                className="text-gray-800 w-36 rounded-sm outline-none ring-indigo-300 transition duration-100 focus-visible:ring bg-slate-100"
                                autoComplete="off"
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
                                className="bg-indigo-500 hover:bg-indigo-400 focus-visible:ring active:bg-indigo-600 text-white ml-2 px-4 rounded"
                            >
                                Create
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default MapPage
