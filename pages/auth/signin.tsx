import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getCsrfToken } from 'next-auth/react'
import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'

const SignIn = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (event: any) => {
        setEmail(event.target.value)
    }
    const handleSignIn = async () => {
        if (!isLoading) {
            setIsLoading(true)
            await signIn('email', {
                email,
                callbackUrl: process.env.NEXT_PUBLIC_URL + '/placemap',
            })
            setIsLoading(false)
        }
    }
    return (
        <div className="bg-white flex items-center justify-center h-screen">
            <div className="py-6 sm:py-8 lg:py-12 w-full max-w-lg mx-auto">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 md:text-3xl">
                        Sign in to Place Keeper
                    </h2>
                    <form
                        method="post"
                        action="/api/auth/signin/email"
                        className="mx-auto max-w-lg rounded-lg border"
                    >
                        <div className="flex flex-col gap-4 p-4 md:p-8">
                            <div>
                                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                                <label
                                    htmlFor="email"
                                    className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    value={email}
                                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button
                                className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
                                onClick={handleSignIn}
                                disabled={isLoading}
                            >
                                Sign in
                            </button>
                        </div>

                        <div className="flex items-center justify-center bg-gray-100 p-4">
                            <p className="text-center text-sm text-gray-500">
                                New registration is also available here{' '}
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* <button
                className="text-black"
                onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL })}
            >
                Sign out
            </button> */}

            {/* <div className="bg-white flex flex-col items-center justify-center h-screen">
                <form method="post" action="/api/auth/signin/email">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <label className="text-black">
                        Email address:{' '}
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            className="text-black border border-black"
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <br />
                    <button
                        type="button"
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className="text-black"
                    >
                        {isLoading ? 'Loading...' : 'Sign in with Email'}
                    </button>
                </form>
                <br />
                
            </div> */}
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const csrfToken = await getCsrfToken(context)
    return {
        props: { csrfToken },
    }
}

export default SignIn
