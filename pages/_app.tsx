import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
    return (
        <SessionProvider
            session={session}
            // Re-fetch session every 5 minutes
            refetchInterval={5 * 60}
            // Re-fetches session when window is focused
            refetchOnWindowFocus={true}
        >
            <Component {...pageProps} />
        </SessionProvider>
    )
}
