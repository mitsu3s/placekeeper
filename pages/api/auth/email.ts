import { createTransport } from 'nodemailer'
import { Theme } from 'next-auth'

export async function customSendVerificationRequest(params: any) {
    const { identifier, url, provider, theme } = params
    const { host } = new URL(url)
    // NOTE: You are not required to use `nodemailer`, use whatever you want.
    const transport = createTransport(provider.server)
    const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Sign in to ${host}`,
        text: text({ url, host }),
        html: html({ url, host, theme }),
    })
    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
    }
}

function html(params: { url: string; host: string; theme: Theme }) {
    const { url, host, theme } = params

    console.log(theme)

    const escapedHost = host.replace(/\./g, '&#8203;.')

    const brandColor = '#6366f1'
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
                PlaceKeeperへのサインインを完了してください。<br/>(<strong>${escapedHost}</strong>)
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
                                >サインイン</a
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
                このメールに覚えがない場合は メールを削除してください。
            </td>
        </tr>
    </table>
    </body>`
}

function text({ url, host }: { url: string; host: string }) {
    return `Sign in to ${host}\n${url}\n\n`
}
