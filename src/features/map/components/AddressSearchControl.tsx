'use client'

import { useState, type FormEvent, type SyntheticEvent } from 'react'
import { Toast } from '@/components/feedback/Toast'
import type { Coordinate } from '@/lib/geo'

interface GsiAddressSearchResult {
    geometry: {
        coordinates: [number, number]
    }
    properties: {
        title: string
    }
}

interface AddressSearchControlProps {
    onSearch: (result: Coordinate & { label: string }) => void
}

function findBestAddressMatch(address: string, results: GsiAddressSearchResult[]) {
    return results.reduce<GsiAddressSearchResult | null>((bestMatch, currentResult) => {
        const currentScore = currentResult.properties.title.split('').reduce((score, character, index) => {
            return score + (character === address[index] ? 1 : 0)
        }, 0)

        if (!bestMatch) {
            return currentResult
        }

        const bestScore = bestMatch.properties.title.split('').reduce((score, character, index) => {
            return score + (character === address[index] ? 1 : 0)
        }, 0)

        return currentScore > bestScore ? currentResult : bestMatch
    }, null)
}

export function AddressSearchControl({ onSearch }: AddressSearchControlProps) {
    const [address, setAddress] = useState('')
    const [showErrorToast, setShowErrorToast] = useState(false)

    async function handleSearchAddress(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!address.trim()) {
            setShowErrorToast(true)
            return
        }

        const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(
            address
        )}`

        try {
            const response = await fetch(url)
            const results = (await response.json()) as GsiAddressSearchResult[]

            if (!Array.isArray(results) || results.length === 0) {
                setShowErrorToast(true)
                return
            }

            const bestMatch = findBestAddressMatch(address, results)

            if (!bestMatch) {
                setShowErrorToast(true)
                return
            }

            const [longitude, latitude] = bestMatch.geometry.coordinates

            onSearch({
                label: address,
                latitude,
                longitude,
            })
        } catch (error) {
            console.error(error)
            setShowErrorToast(true)
        }
    }

    function stopMapPropagation(event: SyntheticEvent) {
        event.stopPropagation()
    }

    return (
        <div className="leaflet-top leaflet-left">
            {showErrorToast ? (
                <div className="z-10">
                    <Toast
                        message="Invalid address."
                        type="error"
                        onClose={() => setShowErrorToast(false)}
                    />
                </div>
            ) : null}
            <div
                className="leaflet-control leaflet-bar"
                onClickCapture={stopMapPropagation}
                onDoubleClickCapture={stopMapPropagation}
                onMouseDownCapture={stopMapPropagation}
                onTouchStartCapture={stopMapPropagation}
            >
                <form
                    className="relative w-44 md:w-48 xl:w-56 bg-white"
                    onSubmit={handleSearchAddress}
                >
                    <label htmlFor="search-address" className="sr-only">
                        Search Address
                    </label>
                    <input
                        type="text"
                        name="search-address"
                        id="search-address"
                        className="p-3 pl-10 block w-full rounded-md border border-gray-200 text-sm text-gray-800 outline-none ring-gray-300 transition duration-100 focus-visible:ring"
                        placeholder="Search Address"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 left-0 flex items-center pl-4"
                    >
                        <span className="sr-only">Search Address</span>
                        <svg
                            className="h-3.5 w-3.5 text-black hover:text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}
