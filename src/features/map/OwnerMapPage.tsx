'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { signOut } from 'next-auth/react'
import { Menu } from 'lucide-react'
import { BrandLink } from '@/components/branding/BrandLink'
import { Toast } from '@/components/feedback/Toast'
import { HOME_ROUTE } from '@/config/app'
import { PlaceFormPanel } from '@/features/places/components/PlaceFormPanel'
import { PlaceTable } from '@/features/places/components/PlaceTable'
import { createPlaceRequest, deletePlaceRequest } from '@/features/places/api/client'
import { saveShareCodeRequest } from '@/features/share/api/client'
import { buildShareMapUrl } from '@/features/share/utils/buildShareMapUrl'
import { generateShareCode } from '@/features/share/utils/generateShareCode'
import { MobileSidebar } from '@/features/map/components/MobileSidebar'
import { UserMenu } from '@/features/map/components/UserMenu'
import type { CreatePlaceFormValues, PlaceItem } from '@/features/places/types'
import { useUrlHash } from '@/hooks/useUrlHash'
import type { Coordinate, LatLngTuple } from '@/lib/geo'
import { DEFAULT_MAP_CENTER, toLatLngTuple } from '@/lib/geo'
import { createPlaceHash } from '@/lib/hash'
import { HttpRequestError } from '@/lib/fetch-json'

const MapCanvas = dynamic(() => import('@/features/map/components/MapCanvas'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
})

type ToastState = {
    message: string
    type: 'error' | 'success' | 'info' | 'warning'
} | null

export interface OwnerMapPageProps {
    initialPlaces: PlaceItem[]
    initialShareCode: string
    userEmail: string | null
}

export default function OwnerMapPage({
    initialPlaces,
    initialShareCode,
    userEmail,
}: OwnerMapPageProps) {
    const [, setHash] = useUrlHash()

    const [places, setPlaces] = useState(initialPlaces)
    const [selectedPosition, setSelectedPosition] = useState<LatLngTuple | null>(null)
    const [centerPosition, setCenterPosition] = useState<LatLngTuple>(
        initialPlaces[0] ? toLatLngTuple(initialPlaces[0]) : DEFAULT_MAP_CENTER
    )
    const [routingPoints, setRoutingPoints] = useState<Coordinate[]>([])
    const [shareCode, setShareCode] = useState(initialShareCode)
    const [isCreatingPlace, setIsCreatingPlace] = useState(false)
    const [isDeletingPlaceId, setIsDeletingPlaceId] = useState<string | null>(null)
    const [isGeneratingShareCode, setIsGeneratingShareCode] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [toast, setToast] = useState<ToastState>(null)

    function handleMapSelect({ latitude, longitude }: Coordinate) {
        setSelectedPosition([latitude, longitude])
    }

    function focusPlace(placeName: string, latitude: number, longitude: number) {
        setCenterPosition([latitude, longitude])
        setHash(createPlaceHash(placeName))
        setIsSidebarOpen(false)
    }

    async function handleCreatePlace(values: CreatePlaceFormValues) {
        if (!selectedPosition) {
            return false
        }

        try {
            setIsCreatingPlace(true)

            const createdPlace = await createPlaceRequest({
                name: values.name,
                description: values.description,
                latitude: selectedPosition[0],
                longitude: selectedPosition[1],
            })

            setPlaces((currentPlaces) => [...currentPlaces, createdPlace])
            setCenterPosition(selectedPosition)
            setSelectedPosition(null)
            return true
        } catch (error) {
            console.error(error)
            setToast({
                message: 'Failed to create place.',
                type: 'error',
            })
            return false
        } finally {
            setIsCreatingPlace(false)
        }
    }

    async function handleDeletePlace(placeId: string) {
        try {
            setIsDeletingPlaceId(placeId)
            await deletePlaceRequest(placeId)
            setPlaces((currentPlaces) => currentPlaces.filter((place) => place.id !== placeId))
        } catch (error) {
            console.error(error)
            setToast({
                message: 'Failed to delete place.',
                type: 'error',
            })
        } finally {
            setIsDeletingPlaceId(null)
        }
    }

    async function handleCopyShareUrl() {
        if (!shareCode) {
            return
        }

        try {
            await navigator.clipboard.writeText(buildShareMapUrl(shareCode))
            setToast({
                message: 'URL copied to clipboard!',
                type: 'success',
            })
            setIsUserMenuOpen(false)
        } catch (error) {
            console.error(error)
            setToast({
                message: 'Failed to copy URL.',
                type: 'error',
            })
        }
    }

    async function handleGenerateShareCode() {
        try {
            setIsGeneratingShareCode(true)

            let nextShareCode = ''

            for (let attempt = 0; attempt < 5; attempt += 1) {
                const candidate = generateShareCode(10)

                try {
                    const response = await saveShareCodeRequest(candidate)
                    nextShareCode = response.shareId
                    break
                } catch (error) {
                    if (error instanceof HttpRequestError && error.statusCode === 409) {
                        continue
                    }

                    throw error
                }
            }

            if (!nextShareCode) {
                throw new Error('Unable to generate a unique share code')
            }

            setShareCode(nextShareCode)
            setToast({
                message: 'Share code generated.',
                type: 'success',
            })
            setIsUserMenuOpen(false)
        } catch (error) {
            console.error(error)
            setToast({
                message: 'Failed to generate share code.',
                type: 'error',
            })
        } finally {
            setIsGeneratingShareCode(false)
        }
    }

    return (
        <div className="bg-white flex min-h-screen w-full flex-col items-center">
            {toast ? (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            ) : null}
            <header className="mb-4 flex h-20 w-full items-center bg-white shadow-md sm:h-16">
                <div className="container mx-auto flex items-center justify-between px-6">
                    <button
                        type="button"
                        className="block rounded-md p-2 transition-all duration-200 hover:bg-gray-100 md:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6 text-black" />
                    </button>
                    <BrandLink className="text-lg sm:text-xl md:text-2xl" />
                    <UserMenu
                        email={userEmail}
                        isOpen={isUserMenuOpen}
                        isGeneratingShareCode={isGeneratingShareCode}
                        onOpenChange={setIsUserMenuOpen}
                        onCopyShareUrl={handleCopyShareUrl}
                        onGenerateShareCode={handleGenerateShareCode}
                        onSignOut={() => signOut({ callbackUrl: HOME_ROUTE })}
                        shareCode={shareCode}
                    />
                </div>
            </header>

            <div className="w-full flex flex-col gap-4 px-1 md:flex-row">
                <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
                    <PlaceTable
                        places={places}
                        onPlaceSelect={(place) =>
                            focusPlace(place.name, place.latitude, place.longitude)
                        }
                        onRouteSelectionChange={setRoutingPoints}
                        onDeletePlace={handleDeletePlace}
                        deletingPlaceId={isDeletingPlaceId}
                    />
                    <PlaceFormPanel
                        selectedPosition={selectedPosition}
                        isSubmitting={isCreatingPlace}
                        onSubmit={handleCreatePlace}
                    />
                </MobileSidebar>
                <div className="w-full md:w-3/4">
                    <MapCanvas
                        places={places}
                        center={centerPosition}
                        routingPoints={routingPoints}
                        selectedPosition={selectedPosition}
                        onMapSelect={handleMapSelect}
                        onAddressSelect={({ label, latitude, longitude }) =>
                            focusPlace(label, latitude, longitude)
                        }
                    />
                </div>
            </div>
            <div className="py-6 text-sm text-gray-500 md:hidden">
                <Link href={HOME_ROUTE}>Back to Home</Link>
            </div>
        </div>
    )
}
