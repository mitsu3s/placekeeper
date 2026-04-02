import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { BrandLink } from '@/components/branding/BrandLink'
import { Toast } from '@/components/feedback/Toast'
import { PageMeta } from '@/components/seo/PageMeta'
import { HOME_ROUTE, OWNER_MAP_ROUTE, SHARE_MAP_ROUTE, SIGN_IN_ROUTE } from '@/config/app'

type ToastState = {
    message: string
    type: 'error' | 'success' | 'info' | 'warning'
} | null

export default function HomePage() {
    const router = useRouter()
    const { data: session } = useSession()

    const [toast, setToast] = useState<ToastState>(null)
    const [shareCode, setShareCode] = useState('')

    useEffect(() => {
        if (!router.isReady || router.query.invalidShareCode !== 'true') {
            return
        }

        setToast({
            message: 'Invalid Share Code.',
            type: 'error',
        })

        void router.replace(HOME_ROUTE, undefined, { shallow: true })
    }, [router, router.isReady, router.query.invalidShareCode])

    function handleOwnerMapClick() {
        if (!session) {
            setToast({
                message: 'You are not signed in.',
                type: 'error',
            })
            return
        }

        void router.push(OWNER_MAP_ROUTE)
    }

    function handleShowShareMap() {
        const normalizedShareCode = shareCode.trim()

        if (!normalizedShareCode) {
            return
        }

        void router.push(`${SHARE_MAP_ROUTE}?sharecode=${encodeURIComponent(normalizedShareCode)}`)
    }

    return (
        <div
            className="text-black min-h-screen"
            style={{
                background: `
                    radial-gradient(circle at 80% 70%, rgba(240, 200, 250, 0.3) 6%, transparent 35%),
                    radial-gradient(circle at 35% 75%, rgba(245, 225, 250, 0.2) 5%, transparent 50%),
                    radial-gradient(circle at 20% 30%, rgba(250, 220, 250, 0.4) 7%, transparent 30%),
                    radial-gradient(circle at 75% 75%, rgba(255, 210, 230, 0.25) 8%, transparent 40%),
                    #ffffff
                `,
            }}
        >
            <PageMeta title="Place Keeper" />
            <header className="fixed top-0 left-0 w-full bg-white shadow-md backdrop-blur-md z-50">
                <div className="container mx-auto flex items-center justify-between px-6 py-6">
                    <BrandLink className="text-3xl tracking-wide font-extrabold" />
                    {toast ? (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    ) : null}
                    <nav className="flex space-x-6 text-lg text-gray-700">
                        <button
                            type="button"
                            onClick={handleOwnerMapClick}
                            className="hover:text-black transition"
                        >
                            Owner Map
                        </button>
                        {!session ? (
                            <Link href={SIGN_IN_ROUTE} className="hover:text-black transition">
                                Sign In
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className="hover:text-black transition"
                                onClick={() => signOut({ callbackUrl: HOME_ROUTE })}
                            >
                                Sign Out
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                    Share Maps Instantly <br className="hidden md:block" />
                    No Sign-ups for Viewers
                </h1>
                <p className="mt-6 max-w-xl text-lg text-gray-700">
                    Just pin locations and share with a URL or short code.{' '}
                    <br className="hidden md:block" />
                    Anyone can view your map, no login or app needed.{' '}
                    <br className="hidden md:block" />
                    You create and manage maps with simple email sign-in.
                </p>

                <div className="mt-10 flex flex-col items-center">
                    <p className="text-md font-semibold text-gray-600">Have a shared code?</p>
                    <div className="mt-4 flex items-center space-x-4">
                        <input
                            type="text"
                            className="w-64 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="Enter Share Code"
                            value={shareCode}
                            onChange={(event) => setShareCode(event.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleShowShareMap}
                            className={`px-5 py-2 rounded-lg transition ${
                                !shareCode.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                            disabled={!shareCode.trim()}
                        >
                            Show
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

