import { useSession, signIn, signOut } from 'next-auth/react'

const AuthTest = () => {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <h1>Loading...</h1>
    }

    if (session) {
        return (
            <div>
                Signed in as {session.user?.email} <br />
                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}
                >
                    Sign out
                </button>
            </div>
        )
    }
    return (
        <div>
            Not signed in <br />
            <button
                type="button"
                onClick={() => signIn(undefined, { callbackUrl: 'http://localhost:3000/auth' })}
            >
                Sign in
            </button>
        </div>
    )
}

export default AuthTest
