import type { GetServerSideProps } from 'next'
import SharedMapPage, { type SharedMapPageProps } from '@/features/map/SharedMapPage'
import { listPlacesForUser } from '@/server/places/service'
import { findShareByCode } from '@/server/share/service'

export const getServerSideProps: GetServerSideProps<SharedMapPageProps> = async (context) => {
    const shareCode =
        typeof context.query.sharecode === 'string' ? context.query.sharecode.trim() : ''

    if (!shareCode) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    try {
        const share = await findShareByCode(shareCode)

        if (!share) {
            return {
                redirect: {
                    destination: '/?invalidShareCode=true',
                    permanent: false,
                },
            }
        }

        const places = await listPlacesForUser(share.userId)

        return {
            props: {
                places,
            },
        }
    } catch (error) {
        console.error(error)

        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
}

export default SharedMapPage
