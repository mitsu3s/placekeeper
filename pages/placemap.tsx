import { NextPage, GetServerSideProps } from 'next'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSession, signOut, getSession } from 'next-auth/react'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
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
    const session = await getSession(context)

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

    const handleCreate = async (values: PlaceForm) => {
        values.latitude = selectedPosition ? selectedPosition[0] : ''
        values.longitude = selectedPosition ? selectedPosition[1] : ''

        if (session) {
            try {
                values.userId = session.user.id
                await axios.post('/api/place/create', values)
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
        <div className="bg-white flex flex-col items-center h-screen">
            <CommonMeta title="User Map" />
            <header className="z-30 flex items-center w-full h-20 sm:h-16 bg-indigo-500 mb-4">
                <div className="container flex items-center justify-between px-6 mx-auto">
                    <Link
                        href="/"
                        className="text-lg sm:text-xl font-black uppercase text-white md:text-2xl"
                    >
                        Place Keeper
                    </Link>
                    {/* <div className="flex items-center">
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
                    </div> */}
                    <div className="relative inline-block">
                        <button
                            type="button"
                            className="uppercase text-md md:text-base lg:text-lg font-sen text-white py-3 px-4 inline-flex justify-center items-center gap-2 transition-all"
                            onMouseEnter={showDropdown}
                            onMouseLeave={hideDropdown}
                        >
                            Actions
                            <svg
                                className={`w-2.5 h-2.5 text-white ${isOpen ? 'rotate-180' : ''}`}
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
                                className="transition-[opacity,margin] duration opacity-100 absolute right-0 mt-2 min-w-[10rem] bg-white shadow-lg rounded-lg p-2 after:h-4 after:absolute after:-bottom-4 after:left-0 after:w-full before:h-4 before:absolute before:-top-4 before:left-0 before:w-full z-50  border-indigo-100 border-2"
                                onMouseEnter={showDropdown}
                                onMouseLeave={hideDropdown}
                            >
                                <div className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-indigo-100 focus:ring-2 focus:ring-blue-500">
                                    User: {session?.user.email}
                                </div>
                                {shareCode && (
                                    <div className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-indigo-100 focus:ring-2 focus:ring-blue-500">
                                        ShareCode: {shareCode}
                                    </div>
                                )}
                                {!shareCode && (
                                    <button
                                        onClick={handleGenerateShareCode}
                                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-indigo-100 focus:ring-2 focus:ring-blue-500 w-full"
                                    >
                                        Generate Share Code
                                    </button>
                                )}
                                <button
                                    className="uppercase flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-indigo-100 focus:ring-2 focus:ring-blue-500 w-full"
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
            <div className="w-full flex justify-start px-1">
                <PlaceTable
                    places={places}
                    handlePlaceClick={handlePlaceClick}
                    updateRoutingPoints={updateRoutingPoints}
                    canDelete={true}
                />
                <Map
                    places={places}
                    selectedPosition={selectedPosition}
                    handleMapClick={handleMapClick}
                    center={centerPosition}
                    routingPoints={routigPoints}
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
