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
        <div className="bg-white flex flex-col items-center justify-center h-screen">
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
            <button
                className="text-black"
                onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL })}
            >
                Sign out
            </button>
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
