import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ToastMessageProps } from '@/libs/interface/props'
import styles from '@/styles/toast.module.css'

const typeClassMap: Record<ToastMessageProps['type'], string> = {
    success: 'bg-green-100 border-green-200 text-green-500',
    error: 'bg-red-100 border-red-200 text-red-500',
    info: 'bg-blue-100 border-blue-200 text-blue-500',
    warning: 'bg-yellow-100 border-yellow-200 text-yellow-500',
}

const buttonColorMap: Record<ToastMessageProps['type'], string> = {
    success: 'text-green-400 hover:text-green-600 focus:ring-green-400 focus:ring-offset-green-100',
    error: 'text-red-400 hover:text-red-600 focus:ring-red-400 focus:ring-offset-red-100',
    info: 'text-blue-400 hover:text-blue-600 focus:ring-blue-400 focus:ring-offset-blue-100',
    warning:
        'text-yellow-400 hover:text-yellow-600 focus:ring-yellow-400 focus:ring-offset-yellow-100',
}

export const ToastMessage: NextPage<ToastMessageProps> = ({
    setshowToastMessage,
    message,
    type,
    shouldReload,
}) => {
    const router = useRouter()
    const handleClick = () => {
        setshowToastMessage(false)
        if (shouldReload) {
            router.push('/')
        }
    }
    return (
        <div className={styles.toastContainer}>
            <div
                className={`max-w-xs text-sm rounded-md shadow-md border ${typeClassMap[type]}`}
                role="alert"
            >
                <div className="flex p-4">
                    {message}
                    <div className="ml-auto md:ml-2">
                        <button
                            type="button"
                            onClick={handleClick}
                            className={`inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm ${buttonColorMap[type]}`}
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="w-3.5 h-3.5"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
