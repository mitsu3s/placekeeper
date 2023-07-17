import { useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client'

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

const ShareMapPage = ({ places }: any) => {
    console.log(places)
    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen">
            <p className="text-black">ShareMapPage</p>
        </div>
    )
}

export default ShareMapPage
