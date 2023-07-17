import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useHash } from '@/libs/useHash'
import { PrismaClient } from '@prisma/client'
import PlaceTable from '@/components/PlaceTable'

const prisma = new PrismaClient()

export const getServerSideProps = async (context: any) => {
    const { sharecode } = context.query

    const adminUser = await prisma.share.findUnique({
        where: {
            shareId: sharecode,
        },
    })

    const places = await prisma.place.findMany({
        where: {
            userId: adminUser?.userId,
        },
    })

    return {
        props: {
            places,
        },
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

    const handlePlaceClick = (placeName: string, lat: number, lng: number) => {
        setCenterPosition([lat, lng])
        setHash(formatPlaceNameForHash(placeName))
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
        </div>
    )
}

export default ShareMapPage
