import { CenteredMessagePage } from '@/components/layout/CenteredMessagePage'

export default function NotFoundPage() {
    return (
        <CenteredMessagePage
            title="Page Not Found"
            description={
                <>
                    This link is not valid.
                    <br />
                    Please click the link below to return to the top page.
                </>
            }
            actionHref="/"
            actionLabel="Back to Home"
        />
    )
}
