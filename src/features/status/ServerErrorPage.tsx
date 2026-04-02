import { CenteredMessagePage } from '@/components/layout/CenteredMessagePage'

export default function ServerErrorPage() {
    return (
        <CenteredMessagePage
            metaTitle="500 - Place Keeper"
            title="Internal Server Error"
            description={
                <>
                    An error has occurred on the server.
                    <br />
                    Sorry for the inconvenience.
                </>
            }
            actionHref="/"
            actionLabel="Back to Home"
        />
    )
}

