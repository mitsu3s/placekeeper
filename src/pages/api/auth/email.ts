import { createTransport, SendMailOptions } from 'nodemailer'
import { EmailRequestParams, EmailHtmlParams } from '@/libs/interface/param'

export async function customSendVerificationRequest(params: EmailRequestParams) {
    const { identifier, url, provider, theme } = params
    const { host } = new URL(url)
    const transport = createTransport(provider.server)

    const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Sign in to ${host}`,
        text: text({ url, host }),
        html: html({ url, host, theme }),
    } as SendMailOptions)

    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
    }
}

const html = (params: EmailHtmlParams) => {
    const { url, host, theme } = params

    const escapedHost = host.replace(/\./g, '&#8203;.')

    const brandColor = '#826eff'
    const color = {
        background: '#f9f9f9',
        text: '#1F2937',
        mainBackground: '#ffffff',
        buttonBackground: brandColor,
        buttonBorder: brandColor,
        buttonText: '#fff',
    }

    return `
    <body style="background: ${color.background};">
    <table
        width="100%"
        border="0"
        cellspacing="20"
        cellpadding="0"
        style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;"
    >
        <tr>
            <td
                align="center"
                style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};"
            >
                Please complete the sign in to Place Keeper. <br/>(<strong>${escapedHost}</strong>)
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 20px 0">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td
                            align="center"
                            style="border-radius: 5px"
                            bgcolor="${color.buttonBackground}"
                        >
                            <a
                                href="${url}"
                                target="_blank"
                                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;"
                                >Sign In</a
                            >
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td
                align="center"
                style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};"
            >
                If you do not recognize this email, please delete it.
            </td>
        </tr>
    </table>
    </body>`
}

const text = ({ url, host }: { url: string; host: string }) => {
    return `Sign in to ${host}\n${url}\n\n`
}
