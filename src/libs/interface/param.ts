import { Theme } from 'next-auth'
import { EmailConfig } from 'next-auth/providers'

export interface EmailRequestParams {
    identifier: string
    url: string
    provider: EmailConfig
    theme: Theme
}

export interface EmailHtmlParams {
    url: string
    host: string
    theme: Theme
}
