import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}
