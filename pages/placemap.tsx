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

const prisma = new PrismaClient()

interface Place {
    id: number
    latitude: number
    longitude: number
    name: string
    description: string
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
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto mx-4">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border rounded-lg divide-y divide-gray-200">
                                <div className="py-3 px-4">
                                    <div className="relative max-w-xs">
                                        <label htmlFor="hs-table-search" className="sr-only">
                                            Search
                                        </label>
                                        <input
                                            type="text"
                                            name="hs-table-search"
                                            id="hs-table-search"
                                            className="p-3 pl-10 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                                            placeholder="Search htmlFor items"
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                                            <svg
                                                className="h-3.5 w-3.5 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 ">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3 px-4 pr-0">
                                                    <div className="flex items-center h-5"></div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                                >
                                                    Place Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                                                >
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 ">
                                            {places &&
                                                places.length > 0 &&
                                                places.map((place, index) => (
                                                    <tr key={index}>
                                                        <td className="py-3 pl-4">
                                                            <div className="flex items-center h-5">
                                                                <input
                                                                    id={`hs-table-search-checkbox-${index}`}
                                                                    type="checkbox"
                                                                    className="border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <label
                                                                    htmlFor="hs-table-search-checkbox-1"
                                                                    className="sr-only"
                                                                >
                                                                    Checkbox
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                            <a
                                                                href={`/#${formatPlaceNameForHash(
                                                                    place.name
                                                                )}`}
                                                                onClick={(event) => {
                                                                    event.preventDefault()
                                                                    handlePlaceClick(
                                                                        place.name,
                                                                        place.latitude,
                                                                        place.longitude
                                                                    )
                                                                }}
                                                            >
                                                                {place.name}
                                                            </a>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <a
                                                                className="text-blue-500 hover:text-blue-700"
                                                                href="#"
                                                            >
                                                                Delete
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
