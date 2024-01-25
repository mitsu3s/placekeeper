import { NextPage, GetServerSideProps } from 'next'
import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ShareMapPageProps } from '@/libs/interface/props'
import { PlaceCoordinate } from '@/libs/interface/type'
import { getPlaces } from '@/handlers/place/get'
import { getAdmin } from '@/handlers/share/get'
import { useHash } from '@/utils/useHash'
import { replaceSpace } from '@/utils/replaceSpace'
import { CommonMeta } from '@/components/CommonMeta'
import { PlaceTable } from '@/components/PlaceTable'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const sharecode = context.query.sharecode as string

    if (!sharecode) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    try {
        const admin = await getAdmin(sharecode)

        if (!admin) {
            return {
                redirect: {
                    destination: '/?invalidShareCode=true',
                    permanent: false,
                },
            }
        }

        const places = await getPlaces(admin.userId)

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

const centerLatitude = 35.17096778816617
const centerLongitude = 136.8829223456777

const ShareMapPage: NextPage<ShareMapPageProps> = ({ places }) => {
    const [, setHash] = useHash()
    const [centerPosition, setCenterPosition] = useState<[number, number]>([
        places.length > 0 ? places[0].latitude : centerLatitude,
        places.length > 0 ? places[0].longitude : centerLongitude,
    ])
    const [routingPoints, setRoutingPoints] = useState<PlaceCoordinate[]>([])

    const ShareMap = React.useMemo(
        () =>
            dynamic(() => import('@/components/ShareMap'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    const handlePlaceClick = (placeName: string, latitude: number, longitude: number) => {
        setCenterPosition([latitude, longitude])
        setHash(replaceSpace(placeName))
    }

    const updateRoutingPoints = (selectedRoutingpoints: PlaceCoordinate[]) => {
        setRoutingPoints(selectedRoutingpoints)
    }

    return (
        <div className="bg-white flex flex-col items-center h-screen">
            <CommonMeta title="Share Map - Place Keeper" />
            <header className="z-30 flex items-center w-full h-14 sm:h-20 bg-[#826eff]">
                <div className="container flex items-center justify-between px-6 mx-auto">
                    <Link href="/" className="text-2xl font-black uppercase text-white md:text-3xl">
                        Place Keeper
                    </Link>
                    <div className="flex items-center">
                        <nav className="items-center text-lg uppercase font-sen text-white lg:flex">
                            <Link
                                href="/auth/signin"
                                className="flex px-6 py-2 hover:text-gray-300"
                            >
                                Create your Map!
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <div className="w-full flex justify-start mt-8">
                <PlaceTable
                    places={places}
                    handlePlaceClick={handlePlaceClick}
                    updateRoutingPoints={updateRoutingPoints}
                    canDelete={false}
                />
                <ShareMap places={places} center={centerPosition} routingPoints={routingPoints} />
            </div>
        </div>
    )
}

export default ShareMapPage
