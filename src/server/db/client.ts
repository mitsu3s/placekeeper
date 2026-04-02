import 'server-only'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/generated/prisma/client'

const DEFAULT_MYSQL_PORT = 3306
const DEFAULT_CONNECT_TIMEOUT_MS = 5_000
const DEFAULT_IDLE_TIMEOUT_SECONDS = 300

type PrismaClientInstance = InstanceType<typeof PrismaClient>

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClientInstance
}

function requireDatabaseUrl() {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set')
    }

    return databaseUrl
}

function parseOptionalInteger(value: string | null) {
    if (!value) {
        return undefined
    }

    const parsedValue = Number(value)
    return Number.isInteger(parsedValue) ? parsedValue : undefined
}

function createMariaDbAdapter(databaseUrl: string) {
    const url = new URL(databaseUrl)
    const database = decodeURIComponent(url.pathname.replace(/^\//, ''))

    if (!database) {
        throw new Error('DATABASE_URL must include a database name')
    }

    const connectionLimit = parseOptionalInteger(url.searchParams.get('connection_limit'))

    return new PrismaMariaDb({
        host: url.hostname,
        port: url.port ? Number(url.port) : DEFAULT_MYSQL_PORT,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database,
        connectTimeout: DEFAULT_CONNECT_TIMEOUT_MS,
        idleTimeout: DEFAULT_IDLE_TIMEOUT_SECONDS,
        ...(connectionLimit ? { connectionLimit } : {}),
    })
}

const prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: createMariaDbAdapter(requireDatabaseUrl()),
    })

export const prisma = prismaClient

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient
}
