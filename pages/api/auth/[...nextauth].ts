import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default NextAuth({
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
        }),
    ],
    secret: process.env.SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.user.id = user.id
            return session
        },
    },
    theme: {
        colorScheme: 'light',
    },
})
