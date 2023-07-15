import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ToastMessage from '@/components/Toast'

const Home = () => {
    const { data: session, status } = useSession()
    const [showToast, setShowToast] = useState(false)
    const { push, asPath } = useRouter()

    const handleLinkClick = () => {
        if (!session) {
            setShowToast(true)
        }
    }

    const handleSignin = () => {
        push(`/auth/signin?callbackUrl=${asPath}`)
    }

    const getLink = () => {
        return session ? '/placemap' : '#'
    }

    return (
        <div className="bg-slate-100 h-screen">
            <header className="z-30 flex items-center w-full h-24 sm:h-32 bg-indigo-500">
                <div className="container flex items-center justify-between px-6 mx-auto">
                    <Link
                        href="/"
                        className="text-3xl font-black text-gray-800 uppercase dark:text-white"
                    >
                        Place Keeper
                    </Link>
                    {showToast && <ToastMessage setShowToast={setShowToast} />}
                    <div className="flex items-center">
                        <nav className="items-center hidden text-lg text-gray-800 uppercase font-sen dark:text-white lg:flex">
                            <Link
                                href={getLink()}
                                onClick={handleLinkClick}
                                className="flex px-6 py-2"
                            >
                                Map
                            </Link>
                            <Link href="/auth/signin" className="flex px-6 py-2">
                                Sign In
                            </Link>
                        </nav>
                        <button className="flex flex-col ml-4 lg:hidden">
                            <span className="w-6 h-1 mb-1 bg-gray-800 dark:bg-white"></span>
                            <span className="w-6 h-1 mb-1 bg-gray-800 dark:bg-white"></span>
                            <span className="w-6 h-1 mb-1 bg-gray-800 dark:bg-white"></span>
                        </button>
                    </div>
                </div>
            </header>
            <section>
                <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
                    <div className="flex flex-col w-full mb-12 text-center">
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 mx-auto mb-5 text-blue-600 rounded-full bg-gray-50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 icon icon-tabler icon-tabler-aperture"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <circle cx="12" cy="12" r="9"></circle>
                                <line x1="3.6" y1="15" x2="14.15" y2="15"></line>
                                <line
                                    x1="3.6"
                                    y1="15"
                                    x2="14.15"
                                    y2="15"
                                    transform="rotate(72 12 12)"
                                ></line>
                                <line
                                    x1="3.6"
                                    y1="15"
                                    x2="14.15"
                                    y2="15"
                                    transform="rotate(144 12 12)"
                                ></line>
                                <line
                                    x1="3.6"
                                    y1="15"
                                    x2="14.15"
                                    y2="15"
                                    transform="rotate(216 12 12)"
                                ></line>
                                <line
                                    x1="3.6"
                                    y1="15"
                                    x2="14.15"
                                    y2="15"
                                    transform="rotate(288 12 12)"
                                ></line>
                            </svg>
                        </div>
                        <h1 className="max-w-5xl text-2xl font-bold leading-none tracking-tighter text-neutral-600 md:text-5xl lg:text-6xl lg:max-w-7xl">
                            Long headline to turn <br className="hidden lg:block"></br>
                            your visitors into users
                        </h1>

                        <p className="max-w-xl mx-auto mt-8 text-base leading-relaxed text-center text-gray-500">
                            Free and Premium themes, UI Kit's, templates and landing pages built
                            with Tailwind CSS, HTML &amp; Next.js.
                        </p>

                        <a
                            className="mx-auto mt-8 text-sm font-semibold text-blue-600 hover:text-neutral-600"
                            title="read more"
                        >
                            {' '}
                            Read more about the offer »{' '}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
