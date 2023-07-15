import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getCsrfToken } from 'next-auth/react'
import { signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function SignIn({
    csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [email, setEmail] = useState('')

    return (
        <form method="post" action="/api/auth/signin/email">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
                Email address
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="text-black"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <button
                type="submit"
                onClick={() =>
                    signIn('email', {
                        email,
                        callbackUrl: 'http://localhost:3000/placemap',
                    })
                }
            >
                Sign in with Email
            </button>
            <button
                type="button"
                onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL })}
            >
                Sign out
            </button>
        </form>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const csrfToken = await getCsrfToken(context)
    return {
        props: { csrfToken },
    }
}
