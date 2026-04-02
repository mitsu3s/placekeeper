import 'server-only'
import type { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/server/db/client'
import { customSendVerificationRequest } from '@/server/auth/email'

type NextAuthPrismaClient = Parameters<typeof PrismaAdapter>[0]

export const authOptions: NextAuthOptions = {
    // Auth.js has not updated its Prisma adapter types for Prisma 7's new client yet.
    adapter: PrismaAdapter(prisma as unknown as NextAuthPrismaClient),
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
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? process.env.SECRET,
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
