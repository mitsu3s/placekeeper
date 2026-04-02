import { CenteredMessagePage } from '@/components/layout/CenteredMessagePage'
import { SIGN_IN_ROUTE } from '@/config/app'

export default function AuthErrorPage() {
    return (
        <CenteredMessagePage
            metaTitle="Auth Error - Place Keeper"
            title="Unable to sign in"
            description={
                <>
                    The sign in link is no longer valid.
                    <br />
                    It may have been used already or it may have expired.
                </>
            }
            actionHref={SIGN_IN_ROUTE}
            actionLabel="Sign In"
        />
    )
}

