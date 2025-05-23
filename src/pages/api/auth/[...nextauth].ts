import NextAuth from 'next-auth'
import { PrismaClient } from '@prisma/client'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { customSendVerificationRequest } from '@/pages/api/auth/email'
import type { NextAuthOptions } from 'next-auth'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            sendVerificationRequest({ identifier: email, url, provider }) {
                return customSendVerificationRequest({
                    identifier: email,
                    url,
                    provider,
                    theme: { colorScheme: 'light' },
                })
            },
        }),
    ],
    secret: process.env.SECRET,
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        verifyRequest: '/auth/verify',
    },
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            return session
        },
    },
    theme: {
        colorScheme: 'light',
    },
}

export default NextAuth(authOptions)
