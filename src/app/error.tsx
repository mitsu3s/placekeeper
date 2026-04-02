'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        console.error(error)
        document.title = '500 - Place Keeper'
    }, [error])

    return (
        <div className="bg-white/95 flex min-h-screen items-center justify-center">
            <div className="mx-auto max-w-md rounded-xl border bg-white">
                <div className="flex flex-col items-center px-12 py-10 text-center">
                    <h1 className="mb-8 text-2xl font-medium text-gray-900">
                        Internal Server Error
                    </h1>
                    <div className="text-md text-gray-500">
                        An error has occurred on the server.
                        <br />
                        Sorry for the inconvenience.
                    </div>
                    <Link href="/" className="pt-4 text-gray-800 border-b-2 border-purple-300">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
