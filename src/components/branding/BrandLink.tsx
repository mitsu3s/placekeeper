import Link from 'next/link'
import { APP_NAME, HOME_ROUTE } from '@/config/app'
import { cn } from '@/lib/cn'

interface BrandLinkProps {
    className?: string
    href?: string
}

export function BrandLink({ className, href = HOME_ROUTE }: BrandLinkProps) {
    return (
        <Link href={href} className={cn('font-black text-black', className)}>
            {APP_NAME}
        </Link>
    )
}

