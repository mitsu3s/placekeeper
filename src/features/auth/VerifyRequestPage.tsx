import { CenteredMessagePage } from '@/components/layout/CenteredMessagePage'

export default function VerifyRequestPage() {
    return (
        <CenteredMessagePage
            metaTitle="Auth Verify - Place Keeper"
            title="Check your email"
            description={
                <>
                    A sign in link has been sent to
                    <br />
                    your email address.
                </>
            }
        />
    )
}

