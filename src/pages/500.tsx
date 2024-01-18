import { NextPage } from 'next'
import Link from 'next/link'
import { CommonMeta } from '@/components/CommonMeta'

const Error: NextPage = () => {
    return (
        <div className="bg-white bg-opacity-95 flex items-center justify-center h-screen">
            <CommonMeta title="500 - Place Keeper" />
            <div className="mx-auto max-w-md rounded-xl bg-white border">
                <div className="px-12 py-10 flex flex-col items-center">
                    <h3 className="text-2xl font-medium text-gray-900 mb-8 text-center">
                        Internal Server Error
                    </h3>
                    <p className="text-md mt-2 text-gray-500 mx-4 text-center">
                        An error has occurred on the server.
                        <br />
                        Sorry for the inconvenience.
                    </p>
                    <Link href="/" className="pt-4 text-gray-800 border-b-2 border-indigo-500">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Error
