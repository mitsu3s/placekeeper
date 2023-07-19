import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useHash } from '@/libs/useHash'
import { PrismaClient } from '@prisma/client'
import PlaceTable from '@/components/PlaceTable'
import dynamic from 'next/dynamic'

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

    const handlePlaceClick = (placeName: string, lat: number, lng: number) => {
        setCenterPosition([lat, lng])
        setHash(formatPlaceNameForHash(placeName))
    }

    const formatPlaceNameForHash = (placeName: string) => {
        return placeName.replace(/\s/g, '_')
    }
    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen">
            <div className="my-2"></div>
            <div className="w-full flex justify-start">
                <PlaceTable
                    places={places}
                    formatPlaceNameForHash={formatPlaceNameForHash}
                    handlePlaceClick={handlePlaceClick}
                />
                <ShareMap places={places} center={centerPosition} />
            </div>
        </div>
    )
}

export default ShareMapPage
