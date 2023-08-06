import { NextPage } from 'next'
import { CommonMeta } from '@/components/CommonMeta'

const Verify: NextPage = () => {
    return (
        <div className="bg-white bg-opacity-95 flex items-center justify-center h-screen">
            <CommonMeta title="Auth Verify" />
            <div className="mx-auto max-w-md rounded-xl bg-white border">
                <div className="px-12 py-10">
                    <h3 className="text-2xl font-medium text-gray-800 mb-8 text-center">
                        Check your email
                    </h3>
                    <p className="text-md mt-7 text-gray-500 mx-4 text-center">
                        A sign in link has been sent to <br />
                        your email address.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Verify
