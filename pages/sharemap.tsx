import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useHash } from '@/libs/useHash'
import { PrismaClient } from '@prisma/client'
import PlaceTable from '@/components/PlaceTable'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const prisma = new PrismaClient()

export const getServerSideProps = async (context: any) => {
    const { sharecode } = context.query
    if (!sharecode) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    try {
        const adminUser = await prisma.share.findUnique({
            where: {
                shareId: sharecode,
            },
        })

        if (!adminUser) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        const places = await prisma.place.findMany({
            where: {
                userId: adminUser.userId,
            },
        })
        return {
            props: {
                places,
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

const centerLatitude = 34.95475940197166
const centerLongitude = 137.15245841041596

const ShareMapPage = ({ places }: any) => {
    const [hash, setHash] = useHash()
    const [centerPosition, setCenterPosition] = useState<[number, number]>([
        centerLatitude,
        centerLongitude,
    ])

    const ShareMap = React.useMemo(
        () =>
            dynamic(() => import('@/components/ShareMap'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    const [waypoints, setWaypoints] = useState<string[]>([])

    const updateWaypoints = (selectedPlaces: any) => {
        const selectedWaypoints = selectedPlaces.map((place: any) => ({
            latitude: place.latitude,
            longitude: place.longitude,
        }))
        setWaypoints(selectedWaypoints)
    }

    const handlePlaceClick = (placeName: string, lat: number, lng: number) => {
        setCenterPosition([lat, lng])
        setHash(formatPlaceNameForHash(placeName))
    }

    const formatPlaceNameForHash = (placeName: string) => {
        return placeName.replace(/\s/g, '_')
    }
    return (
        <div className="bg-white flex flex-col items-center h-screen">
            <header className="z-30 flex items-center w-full h-14 sm:h-20 bg-indigo-500">
                <div className="container flex items-center justify-between px-6 mx-auto">
                    <Link href="/" className="text-2xl font-black uppercase text-white md:text-3xl">
                        Place Keeper
                    </Link>
                    <div className="flex items-center">
                        <nav className="items-center text-lg uppercase font-sen text-white lg:flex">
                            <Link href="/auth/signin" className="flex px-6 py-2">
                                Create your Map!
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <div className="w-full flex justify-start mt-8">
                <PlaceTable
                    places={places}
                    formatPlaceNameForHash={formatPlaceNameForHash}
                    handlePlaceClick={handlePlaceClick}
                    updateWaypoints={updateWaypoints}
                />
                <ShareMap places={places} center={centerPosition} waypoints={waypoints} />
            </div>
        </div>
    )
}

export default ShareMapPage
