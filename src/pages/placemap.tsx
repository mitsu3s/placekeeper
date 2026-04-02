import type { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import OwnerMapPage, { type OwnerMapPageProps } from '@/features/map/OwnerMapPage'
import { HOME_ROUTE } from '@/config/app'
import { authOptions } from '@/server/auth/options'
import { listPlacesForUser } from '@/server/places/service'
import { getShareCodeForUser } from '@/server/share/service'

export const getServerSideProps: GetServerSideProps<OwnerMapPageProps> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user?.id) {
        return {
            redirect: {
                destination: HOME_ROUTE,
                permanent: false,
            },
        }
    }

    try {
        const [initialPlaces, initialShareCode] = await Promise.all([
            listPlacesForUser(session.user.id),
            getShareCodeForUser(session.user.id),
        ])

        return {
            props: {
                initialPlaces,
                initialShareCode,
            },
        }
    } catch (error) {
        console.error(error)

        return {
            redirect: {
                destination: HOME_ROUTE,
                permanent: false,
            },
        }
    }
}

export default OwnerMapPage
