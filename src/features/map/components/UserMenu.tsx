import { useEffect, useRef } from 'react'

interface UserMenuProps {
    email?: string | null
    isOpen: boolean
    isGeneratingShareCode: boolean
    onOpenChange: (isOpen: boolean) => void
    onCopyShareUrl: () => void
    onGenerateShareCode: () => void
    onSignOut: () => void
    shareCode: string
}

export function UserMenu({
    email,
    isOpen,
    isGeneratingShareCode,
    onOpenChange,
    onCopyShareUrl,
    onGenerateShareCode,
    onSignOut,
    shareCode,
}: UserMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                onOpenChange(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onOpenChange])

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                type="button"
                className="text-md md:text-base lg:text-lg text-black py-3 px-4 inline-flex justify-center items-center gap-2 transition-all"
                onClick={() => onOpenChange(!isOpen)}
            >
                User Info
                <svg
                    className={`w-2.5 h-2.5 text-black transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>

            {isOpen ? (
                <div className="absolute right-0 mt-2 min-w-[10rem] rounded-lg border-2 border-gray-300 bg-white p-2 shadow-lg z-10">
                    <div className="flex items-center gap-x-3.5 rounded-md py-2 px-3 text-sm text-gray-800">
                        Email: {email}
                    </div>
                    {shareCode ? (
                        <button
                            type="button"
                            onClick={onCopyShareUrl}
                            className="flex w-full items-center gap-x-3.5 rounded-md py-2 px-3 text-left text-sm text-gray-800 hover:bg-gray-100"
                        >
                            Copy Share URL
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onGenerateShareCode}
                            disabled={isGeneratingShareCode}
                            className="flex w-full items-center gap-x-3.5 rounded-md py-2 px-3 text-sm text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                        >
                            {isGeneratingShareCode ? 'Generating...' : 'Generate Share Code'}
                        </button>
                    )}
                    <button
                        type="button"
                        className="flex w-full items-center gap-x-3.5 rounded-md py-2 px-3 text-sm uppercase text-gray-800 hover:bg-gray-100"
                        onClick={onSignOut}
                    >
                        Sign Out
                    </button>
                </div>
            ) : null}
        </div>
    )
}

