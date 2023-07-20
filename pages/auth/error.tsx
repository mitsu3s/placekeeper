import Link from 'next/link'

const Error = () => {
    return (
        <div className="bg-white bg-opacity-95 flex items-center justify-center h-screen">
            <div className="mx-auto max-w-md rounded-xl bg-white border">
                <div className="px-12 py-10 flex flex-col items-center">
                    <h3 className="text-2xl font-medium text-gray-900 mb-8 text-center">
                        Unable to sign in
                    </h3>
                    <p className="text-md mt-2 text-gray-500 mx-4 text-center">
                        The sign in link is no longer valid.
                        <br />
                        It may have been used already or it may have expired.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="pt-4 text-gray-800 border-b-2 border-indigo-500"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Error
