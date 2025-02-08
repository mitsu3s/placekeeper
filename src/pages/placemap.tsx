import { NextPage, GetServerSideProps } from 'next'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth/next'
import { useSession, signOut } from 'next-auth/react'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { MapPageProps } from '@/libs/interface/props'
import { PlaceForm } from '@/libs/interface/form'
import { PlaceCoordinate } from '@/libs/interface/type'
import { MapFormSchema } from '@/libs/validation/form'
import { getPlaces } from '@/handlers/place/get'
import { getShareId } from '@/handlers/share/get'
import { useHash } from '@/utils/useHash'
import { generateShareCode } from '@/utils/shareCodeGenerator'
import { replaceSpace } from '@/utils/replaceSpace'
import { CommonMeta } from '@/components/CommonMeta'
import { PlaceTable } from '@/components/PlaceTable'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    try {
        const places = await getPlaces(session.user.id)
        const shareId = await getShareId(session.user.id)

        return {
            props: {
                places,
                shareId,
            },
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
}

const centerLatitude = 35.17096778816617
const centerLongitude = 136.8829223456777

const MapPage: NextPage<MapPageProps> = ({ places, shareId }) => {
    const { data: session } = useSession()
    const router = useRouter()

    const [, setHash] = useHash()
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)
    const [centerPosition, setCenterPosition] = useState<[number, number]>([
        places.length > 0 ? places[0].latitude : centerLatitude,
        places.length > 0 ? places[0].longitude : centerLongitude,
    ])
    const [shareCode, setShareCode] = useState(shareId)
    const [routigPoints, setRoutingPoints] = useState<PlaceCoordinate[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const Map = React.useMemo(
        () =>
            dynamic(() => import('@/components/Map'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    const initialValues = {
        placeName: '',
        description: '',
    }

    const handleMapClick = (latitude: number, longitude: number) => {
        setSelectedPosition([latitude, longitude])
    }

    const handlePlaceClick = (placeName: string, latitude: number, longitude: number) => {
        setCenterPosition([latitude, longitude])
        setHash(replaceSpace(placeName))
    }

    const handleSearchClick = (placeName: string, latitude: number, longitude: number) => {
        setCenterPosition([latitude, longitude])
        setHash(replaceSpace(placeName))
    }

    const handleCreate = async (values: PlaceForm) => {
        values.latitude = selectedPosition ? selectedPosition[0] : ''
        values.longitude = selectedPosition ? selectedPosition[1] : ''

        if (session) {
            try {
                setIsLoading(true)
                values.userId = session.user.id
                await axios.post('/api/place/create', values)
                setIsLoading(false)
                router.reload()
            } catch (error) {
                console.log(error)
                router.push('/')
            }
        } else {
            router.push('/')
        }
    }

    const handleGenerateShareCode = async () => {
        if (session) {
            try {
                const newShareCode = generateShareCode(10)
                setShareCode(newShareCode)
                await axios.post('/api/share/create', {
                    shareCode: newShareCode,
                    userId: session.user.id,
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            router.push('/')
        }
    }

    const updateRoutingPoints = (selectedRoutingpoints: PlaceCoordinate[]) => {
        setRoutingPoints(selectedRoutingpoints)
    }

    const showDropdown = () => {
        setIsOpen(true)
    }

    const hideDropdown = () => {
        setIsOpen(false)
    }

    return (
        <div className="bg-white flex flex-col items-center min-h-screen w-full">
            <CommonMeta title="Owner Map - Place Keeper" />
            <header className="flex items-center w-full h-20 sm:h-16 bg-white shadow-md mb-4">
                <div className="container flex items-center justify-between px-6 mx-auto">
                    <Link href="/" className="text-lg sm:text-xl font-black text-black md:text-2xl">
                        Place Keeper
                    </Link>
                    <div className="relative inline-block">
                        <button
                            type="button"
                            className="text-md md:text-base lg:text-lg font-sen text-black py-3 px-4 inline-flex justify-center items-center gap-2 transition-all"
                            onMouseEnter={showDropdown}
                        >
                            User Info
                            <svg
                                className={`w-2.5 h-2.5 text-black ${isOpen ? 'rotate-180' : ''}`}
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>

                        {isOpen && (
                            <div
                                className="transition-opacity duration-200 opacity-100 absolute right-0 mt-2 min-w-[10rem] bg-white shadow-lg rounded-lg p-2 z-10 border-gray-300 border-2"
                                onMouseEnter={showDropdown}
                                onMouseLeave={hideDropdown}
                            >
                                <div className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100">
                                    Email: {session?.user.email}
                                </div>
                                {shareCode ? (
                                    <div className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100">
                                        ShareCode: {shareCode}
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleGenerateShareCode}
                                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 w-full"
                                    >
                                        Generate Share Code
                                    </button>
                                )}
                                <button
                                    className="uppercase flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 w-full"
                                    onClick={() =>
                                        signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL })
                                    }
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="w-full flex flex-col md:flex-row px-1 gap-4">
                <div className="w-full md:w-1/4 md:max-h-full overflow-auto transition-all duration-300">
                    <PlaceTable
                        places={places}
                        handlePlaceClick={handlePlaceClick}
                        updateRoutingPoints={updateRoutingPoints}
                        canDelete={true}
                    />

                    <div className="bg-white py-4 w-full flex justify-center pl-3 pr-4">
                        <div className="border rounded-lg divide-y divide-gray-200 p-4 w-full max-w-2xl">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={MapFormSchema}
                                onSubmit={handleCreate}
                            >
                                {({ isValid }) => (
                                    <Form className="flex flex-col gap-4 w-full">
                                        <div className="px-4">
                                            <div className="relative max-w-xs">
                                                <label
                                                    htmlFor="placeName"
                                                    className="text-gray-500 text-xs uppercase"
                                                >
                                                    Place Name
                                                </label>
                                                <Field
                                                    type="text"
                                                    id="placeName"
                                                    name="placeName"
                                                    className="p-1 block w-full border border-gray-200 text-sm text-gray-800 rounded-md outline-none ring-gray-300 transition duration-100 focus-visible:ring"
                                                    autoComplete="off"
                                                />
                                                <ErrorMessage
                                                    name="placeName"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4">
                                            <div className="relative max-w-xs">
                                                <label
                                                    htmlFor="description"
                                                    className="text-gray-500 text-xs uppercase"
                                                >
                                                    Description
                                                </label>
                                                <Field
                                                    type="text"
                                                    id="description"
                                                    name="description"
                                                    className="p-1 block w-full border border-gray-200 text-sm text-gray-800 rounded-md outline-none ring-gray-300 transition duration-100 focus-visible:ring"
                                                    autoComplete="off"
                                                />
                                                <ErrorMessage
                                                    name="description"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-end px-4">
                                            <button
                                                type="submit"
                                                className={`px-4 py-2 rounded text-sm font-medium 
                                                ${
                                                    isLoading ||
                                                    !isValid ||
                                                    selectedPosition === null
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-black text-white hover:bg-gray-800'
                                                }`}
                                                disabled={
                                                    isLoading ||
                                                    !isValid ||
                                                    selectedPosition === null
                                                }
                                            >
                                                {isLoading ? 'Loading...' : 'Create'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-3/4">
                    <Map
                        places={places}
                        selectedPosition={selectedPosition}
                        handleMapClick={handleMapClick}
                        handleSearchClick={handleSearchClick}
                        center={centerPosition}
                        routingPoints={routigPoints}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapPage
