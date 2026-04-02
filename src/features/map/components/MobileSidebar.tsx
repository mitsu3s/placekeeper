import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface MobileSidebarProps {
    children: ReactNode
    isOpen: boolean
    onClose: () => void
}

export function MobileSidebar({ children, isOpen, onClose }: MobileSidebarProps) {
    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm transform overflow-auto bg-white transition-transform md:relative md:w-1/4 md:max-h-full ${
                isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full md:translate-x-0'
            }`}
        >
            {isOpen ? (
                <div className="flex justify-end p-3 md:hidden">
                    <button
                        type="button"
                        className="p-2 rounded-md transition-all duration-200 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6 text-black" />
                    </button>
                </div>
            ) : null}
            {children}
        </div>
    )
}

