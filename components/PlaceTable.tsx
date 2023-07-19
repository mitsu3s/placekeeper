import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut, getSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/router'

const PlaceTable = ({ places, formatPlaceNameForHash, handlePlaceClick, updateWaypoints }: any) => {
    const [selectedPlaces, setSelectedPlaces] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredPlaces, setFilteredPlaces] = useState<any[]>(places)
    const { data: session, status } = useSession()
    const router = useRouter()

    const handleClick = () => {
        // updateWaypoints(selectedPlaces)
        // console.log(selectedPlaces)
    }

    useEffect(() => {
        updateWaypoints(selectedPlaces)
    }, [selectedPlaces])

    const handleDelete = (placeId: any) => {
        if (session) {
            try {
                console.log(placeId)
                const res = axios.post('/api/place/delete', { placeId: placeId })
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

    const handleCheckboxChange = (place: any) => {
        const isSelected = selectedPlaces.some(
            (p: any) => p.latitude === place.latitude && p.longitude === place.longitude
        )

        if (isSelected) {
            setSelectedPlaces(
                selectedPlaces.filter(
                    (p: any) => !(p.latitude === place.latitude && p.longitude === place.longitude)
                )
            )
        } else {
            if (selectedPlaces.length < 2) {
                setSelectedPlaces([
                    ...selectedPlaces,
                    { latitude: place.latitude, longitude: place.longitude },
                ])
            }
        }
    }

    const handleSearchIconClick = () => {
        const filteredResults = places.filter((place: any) => {
            return place.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
        setFilteredPlaces(filteredResults)
    }

    return (
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
                                    placeholder="Search Place"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div
                                    className="absolute inset-y-0 left-0 flex items-center pl-4"
                                    onClick={handleSearchIconClick}
                                >
                                    <svg
                                        className="h-3.5 w-3.5 text-gray-700"
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
                                        <th
                                            scope="col"
                                            className="pl-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Routing
                                            <br />
                                            Point
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Place Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="pr-3 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                                        >
                                            {/* Action */}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 ">
                                    {places &&
                                        places.length > 0 &&
                                        filteredPlaces.map((place: any, index: any) => (
                                            <tr key={index}>
                                                <td className="py-3 pl-4">
                                                    <div className="flex items-center h-5">
                                                        {places.length > 1 && (
                                                            <input
                                                                id={`hs-table-search-checkbox-${index}`}
                                                                type="checkbox"
                                                                className="border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                                                                checked={selectedPlaces.some(
                                                                    (p: any) =>
                                                                        p.latitude ===
                                                                            place.latitude &&
                                                                        p.longitude ===
                                                                            place.longitude
                                                                )}
                                                                onChange={() =>
                                                                    handleCheckboxChange(place)
                                                                }
                                                            />
                                                        )}
                                                        <label
                                                            htmlFor={`hs-table-search-checkbox-${index}`}
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
                                                <td className="pr-3 py-3 items-center">
                                                    <a
                                                        className="text-black hover:text-blue-700"
                                                        // href="#"
                                                        onClick={() => handleDelete(place.id)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                            />
                                                        </svg>
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
            {/* <button className="bg-slate-300 text-black px-4 mx-6 rounded" onClick={handleClick}>
                Routing
            </button> */}
        </div>
    )
}

export default PlaceTable
