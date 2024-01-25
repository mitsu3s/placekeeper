import { Theme } from 'next-auth'

export interface EmailRequestParams {
    identifier: string
    url: string
    provider: {
        server: {
            host: string
            port: number
            auth: {
                user: string
                pass: string
            }
        }
        from: string
    }
    theme: Theme
}

export interface EmailHtmlParams {
    url: string
    host: string
    theme: Theme
}
