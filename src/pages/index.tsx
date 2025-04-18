import { NextPage } from 'next'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ToastMessage } from '@/components/Toast'
import { CommonMeta } from '@/components/CommonMeta'

const Home: NextPage = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const [showToastMessage, setShowToastMessage] = useState(false)
    const [, setInvalidShareCode] = useState(true)
    const [shareCode, setShareCode] = useState('')

    const handleShowShareMap = () => {
        router.push(`/sharemap?sharecode=${shareCode}`)
    }

    const handleLinkClick = () => {
        if (!session) {
            setShowToastMessage(true)
        }
    }

    const getLink = () => (session ? '/placemap' : '')

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
            <CommonMeta title="Place Keeper" />
            <header className="fixed top-0 left-0 w-full bg-white shadow-md backdrop-blur-md z-50">
                <div className="container mx-auto flex items-center justify-between px-6 py-6">
                    <Link href="/" className="text-3xl font-extrabold text-black tracking-wide">
                        Place Keeper
                    </Link>
                    {showToastMessage && (
                        <ToastMessage
                            setshowToastMessage={setShowToastMessage}
                            message="You are not signed in."
                            shouldReload={false}
                            type="error"
                        />
                    )}
                    {router.query.invalidShareCode && (
                        <ToastMessage
                            setshowToastMessage={setInvalidShareCode}
                            message="Invalid Share Code."
                            shouldReload={true}
                            type="error"
                        />
                    )}
                    <nav className="flex space-x-6 text-lg text-gray-700">
                        <Link
                            href={getLink()}
                            onClick={handleLinkClick}
                            className="hover:text-black transition"
                        >
                            Owner Map
                        </Link>
                        {!session ? (
                            <Link href="/auth/signin" className="hover:text-black transition">
                                Sign In
                            </Link>
                        ) : (
                            <button
                                className="hover:text-black transition"
                                onClick={() =>
                                    signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL })
                                }
                            >
                                Sign Out
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <section className="flex flex-col items-center justify-center h-screen text-center px-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                    Share Maps Instantly <br className="hidden md:block" />
                    No Sign-ups for Viewers
                </h1>
                <p className="mt-6 text-lg text-gray-700 max-w-xl">
                    Just pin locations and share with a URL or short code.{' '}
                    <br className="hidden md:block" />
                    Anyone can view your map — no login or app needed.{' '}
                    <br className="hidden md:block" />
                    You create and manage maps with simple email sign-in.
                </p>

                <div className="mt-10 flex flex-col items-center">
                    <p className="text-md font-semibold text-gray-600">Have a shared code?</p>
                    <div className="mt-4 flex items-center space-x-4">
                        <input
                            type="text"
                            className="w-64 px-4 py-2 bg-gray-100 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="Enter Share Code"
                            value={shareCode}
                            onChange={(e) => setShareCode(e.target.value)}
                        />
                        <button
                            onClick={handleShowShareMap}
                            className={`px-5 py-2 rounded-lg transition ${
                                !shareCode
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                            disabled={!shareCode}
                        >
                            Show
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
