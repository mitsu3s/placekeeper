import type { ReactNode } from 'react'
import Link from 'next/link'
import { PageMeta } from '@/components/seo/PageMeta'

interface CenteredMessagePageProps {
    title: string
    description: ReactNode
    metaTitle: string
    actionHref?: string
    actionLabel?: string
}

export function CenteredMessagePage({
    title,
    description,
    metaTitle,
    actionHref,
    actionLabel,
}: CenteredMessagePageProps) {
    return (
        <div className="bg-white bg-opacity-95 flex min-h-screen items-center justify-center">
            <PageMeta title={metaTitle} />
            <div className="mx-auto max-w-md rounded-xl border bg-white">
                <div className="flex flex-col items-center px-12 py-10 text-center">
                    <h1 className="mb-8 text-2xl font-medium text-gray-900">{title}</h1>
                    <div className="text-md text-gray-500">{description}</div>
                    {actionHref && actionLabel ? (
                        <Link
                            href={actionHref}
                            className="pt-4 text-gray-800 border-b-2 border-purple-300"
                        >
                            {actionLabel}
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

