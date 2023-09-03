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

    const getLink = () => {
        return session ? '/placemap' : ''
    }

    return (
        <div className="bg-slate-100 h-screen">
            <CommonMeta title="Place Keeper" />
            <header className="z-30 flex items-center w-full h-24 sm:h-32 bg-indigo-500">
                <div className="container flex items-center justify-between px-6 mx-auto">
                    <Link
                        href="/"
                        className="text-3xl font-black uppercase text-white flex items-center"
                    >
                        <svg
                            viewBox="-8.4 -8.4 44.80 44.80"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#000000"
                            strokeWidth="0.00028"
                            className="w-14 h-14"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    clipRule="evenodd"
                                    d="M10 7.88974C11.1046 7.88974 12 6.98912 12 5.87814C12 4.76716 11.1046 3.86654 10 3.86654C8.89543 3.86654 8 4.76716 8 5.87814C8 6.98912 8.89543 7.88974 10 7.88974ZM10 6.5822C10.3866 6.5822 10.7 6.26698 10.7 5.87814C10.7 5.4893 10.3866 5.17408 10 5.17408C9.6134 5.17408 9.3 5.4893 9.3 5.87814C9.3 6.26698 9.6134 6.5822 10 6.5822Z"
                                    fill="#ffffff"
                                    fillRule="evenodd"
                                ></path>
                                <path
                                    clipRule="evenodd"
                                    d="M5.15 5.62669C5.15 3.0203 7.37393 1 10 1C12.6261 1 14.85 3.0203 14.85 5.62669C14.85 6.06012 14.8114 6.53528 14.7269 7.03578L18 7.8588L25.7575 5.90818C26.0562 5.83306 26.3727 5.90057 26.6154 6.09117C26.8581 6.28178 27 6.57423 27 6.88395V23.9826C27 24.4441 26.6877 24.8464 26.2425 24.9584L18.2425 26.97C18.0833 27.01 17.9167 27.01 17.7575 26.97L10 25.0193L2.24254 26.97C1.94379 27.0451 1.6273 26.9776 1.38459 26.787C1.14187 26.5964 1 26.3039 1 25.9942V8.89555C1 8.43402 1.3123 8.03172 1.75746 7.91978L5.2731 7.03578C5.18863 6.53528 5.15 6.06012 5.15 5.62669ZM10 2.70986C8.20779 2.70986 6.85 4.06691 6.85 5.62669C6.85 7.21686 7.5125 9.57287 9.40979 11.3615C9.74241 11.6751 10.2576 11.6751 10.5902 11.3615C12.4875 9.57287 13.15 7.21686 13.15 5.62669C13.15 4.06691 11.7922 2.70986 10 2.70986ZM5.80904 8.97453L3.22684 9.62382C3.09349 9.65735 3 9.77726 3 9.91476V24.3212C3 24.5165 3.18371 24.6598 3.37316 24.6121L8.77316 23.2543C8.90651 23.2208 9 23.1009 9 22.9634V13.2506C7.40353 12.024 6.39235 10.4792 5.80904 8.97453ZM11 13.2506V22.9634C11 23.1009 11.0935 23.2208 11.2268 23.2543L16.6268 24.6121C16.8163 24.6598 17 24.5165 17 24.3212V9.91477C17 9.77726 16.9065 9.65735 16.7732 9.62382L14.191 8.97453C13.6076 10.4792 12.5965 12.024 11 13.2506ZM25 22.9634C25 23.1009 24.9065 23.2208 24.7732 23.2543L19.3732 24.6121C19.1837 24.6598 19 24.5165 19 24.3212V9.91477C19 9.77726 19.0935 9.65736 19.2268 9.62382L24.6268 8.26599C24.8163 8.21835 25 8.36159 25 8.55693V22.9634Z"
                                    fill="#ffffff"
                                    fillRule="evenodd"
                                ></path>
                            </g>
                        </svg>
                        Place Keeper
                    </Link>
                    {showToastMessage && (
                        <ToastMessage
                            setshowToastMessage={setShowToastMessage}
                            message={'You are not signed in.'}
                            shouldReload={false}
                        />
                    )}
                    {router.query.invalidShareCode && (
                        <ToastMessage
                            setshowToastMessage={setInvalidShareCode}
                            message={'Invalid Share Code.'}
                            shouldReload={true}
                        />
                    )}
                    <div className="flex items-center">
                        <nav className="items-center text-lg uppercase font-sen text-white lg:flex">
                            <Link
                                href={getLink()}
                                onClick={handleLinkClick}
                                className="flex px-6 py-2 hover:text-gray-300"
                            >
                                Map
                            </Link>
                            {!session && (
                                <Link
                                    href="/auth/signin"
                                    className="flex px-6 py-2 hover:text-gray-300"
                                >
                                    Sign In
                                </Link>
                            )}
                            {session && (
                                <button
                                    className="flex px-6 py-2 uppercase hover:text-gray-300"
                                    onClick={() =>
                                        signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL })
                                    }
                                >
                                    Sign out
                                </button>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
            <section>
                <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-[72px]">
                    <div className="flex flex-col w-full mb-12 text-center">
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 mx-auto mb-5 rounded-full"></div>
                        <h1 className="max-w-5xl text-3xl font-bold leading-none tracking-tighter text-neutral-600 md:text-5xl lg:text-6xl lg:max-w-7xl">
                            Manage favorite location with<br className="hidden lg:block"></br>
                            intuitive controls
                        </h1>

                        <p className="max-w-xl mx-auto mt-8 text-base leading-relaxed text-center text-gray-500">
                            Provides location storage, sharing, and route search for each user.
                            <br />
                            Registration and signin is done via email authentication <br />
                            and no password is required.
                        </p>

                        <p
                            className="mx-auto mt-8 text-sm font-semibold text-indigo-500"
                            title="read more"
                        >
                            {' '}
                            Have a Share Code? »{' '}
                        </p>
                        <div>
                            <input
                                type="text"
                                className="px-4 py-2 mt-2 text-base text-gray-700 placeholder-gray-400 bg-slate-200 border rounded-md outline-none ring-indigo-300 transition duration-100 focus-visible:ring"
                                placeholder="Share Code"
                                value={shareCode}
                                onChange={(e) => setShareCode(e.target.value)}
                            />
                            <button
                                onClick={handleShowShareMap}
                                className="text-white bg-indigo-500 hover:bg-indigo-400 focus-visible:ring active:bg-indigo-600 ml-4 px-4 py-1 rounded"
                                disabled={!shareCode}
                            >
                                Let's Show
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
