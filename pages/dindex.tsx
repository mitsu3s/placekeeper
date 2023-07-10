import dynamic from 'next/dynamic'
import React from 'react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getServerSideProps = async () => {
    const buildings = await prisma.building.findMany()
    console.log(buildings)

    return {
        props: {
            buildings,
        },
    }
}

const IndexPage = ({ buildings }: any) => {
    const DefaultMap = React.useMemo(
        () =>
            dynamic(() => import('@/components/DefaultMap'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    return (
        <div>
            <DefaultMap buildings={buildings} />
        </div>
    )
}

export default IndexPage
