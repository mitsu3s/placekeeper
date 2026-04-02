import Head from 'next/head'
import { APP_DESCRIPTION } from '@/config/app'

interface PageMetaProps {
    title: string
    description?: string
}

export function PageMeta({ title, description = APP_DESCRIPTION }: PageMetaProps) {
    return (
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="description" content={description} />
        </Head>
    )
}
