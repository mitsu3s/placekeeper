import { CommonMetaProps } from '@/libs/interface/props'
import { NextPage } from 'next'
import Head from 'next/head'

const CommonMeta: NextPage<CommonMetaProps> = ({ title }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" name="description" content="Location Sharing App" />
        </Head>
    )
}

export default CommonMeta
