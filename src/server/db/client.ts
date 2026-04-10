import 'server-only'
import { readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import type { PoolConfig } from 'mariadb'
import { PrismaClient } from '@/generated/prisma/client'

const DEFAULT_MYSQL_PORT = 3306
const DEFAULT_CONNECT_TIMEOUT_MS = 5_000
const DEFAULT_ACQUIRE_TIMEOUT_MS = 10_000
const DEFAULT_IDLE_TIMEOUT_SECONDS = 300
const PRISMA_DIRECTORY = resolve(process.cwd(), 'prisma')

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
    return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : undefined
}

function parseOptionalBoolean(value: string | null) {
    if (!value) {
        return undefined
    }

    if (value === 'true') {
        return true
    }

    if (value === 'false') {
        return false
    }

    return undefined
}

function parseSecondsToMilliseconds(value: string | null) {
    const seconds = parseOptionalInteger(value)
    return seconds === undefined ? undefined : seconds * 1_000
}

function parseMillisecondsOption(url: URL, prismaKey: string, driverKey: string) {
    const prismaValue = url.searchParams.get(prismaKey)

    if (prismaValue !== null) {
        return parseSecondsToMilliseconds(prismaValue)
    }

    return parseOptionalInteger(url.searchParams.get(driverKey))
}

function parseSecondsOption(url: URL, prismaKey: string, driverKey: string) {
    const prismaValue = url.searchParams.get(prismaKey)

    if (prismaValue !== null) {
        return parseOptionalInteger(prismaValue)
    }

    return parseOptionalInteger(url.searchParams.get(driverKey))
}

function getSearchParam(url: URL, ...keys: string[]) {
    for (const key of keys) {
        const value = url.searchParams.get(key)

        if (value !== null) {
            return value
        }
    }

    return null
}

function resolvePrismaAssetPath(filePath: string) {
    return isAbsolute(filePath) ? filePath : resolve(PRISMA_DIRECTORY, filePath)
}

function createSslConfig(url: URL): PoolConfig['ssl'] | undefined {
    const sslEnabled = parseOptionalBoolean(getSearchParam(url, 'ssl'))
    const sslAccept = getSearchParam(url, 'sslaccept')
    const sslCert = getSearchParam(url, 'sslcert')
    const sslIdentity = getSearchParam(url, 'sslidentity')
    const sslPassword = getSearchParam(url, 'sslpassword')

    if (
        sslEnabled === undefined &&
        !sslAccept &&
        !sslCert &&
        !sslIdentity &&
        !sslPassword
    ) {
        return undefined
    }

    if (sslEnabled === true && !sslAccept && !sslCert && !sslIdentity && !sslPassword) {
        return true
    }

    if (sslEnabled === false) {
        return undefined
    }

    const sslConfig: Exclude<PoolConfig['ssl'], boolean> = {}

    if (sslAccept === 'strict') {
        sslConfig.rejectUnauthorized = true
    } else if (sslAccept === 'accept_invalid_certs') {
        sslConfig.rejectUnauthorized = false
    }

    if (sslCert) {
        sslConfig.ca = readFileSync(resolvePrismaAssetPath(sslCert), 'utf8')
    }

    if (sslIdentity) {
        sslConfig.pfx = readFileSync(resolvePrismaAssetPath(sslIdentity))
    }

    if (sslPassword) {
        sslConfig.passphrase = sslPassword
    }

    return Object.keys(sslConfig).length > 0 ? sslConfig : true
}

function createMariaDbConfig(databaseUrl: string): PoolConfig {
    const url = new URL(databaseUrl)
    const database = decodeURIComponent(url.pathname.replace(/^\//, ''))

    if (!database) {
        throw new Error('DATABASE_URL must include a database name')
    }

    const connectionLimit = parseOptionalInteger(
        getSearchParam(url, 'connection_limit', 'connectionLimit')
    )
    const connectTimeout =
        parseMillisecondsOption(url, 'connect_timeout', 'connectTimeout') ??
        DEFAULT_CONNECT_TIMEOUT_MS
    const acquireTimeout =
        parseMillisecondsOption(url, 'pool_timeout', 'acquireTimeout') ??
        DEFAULT_ACQUIRE_TIMEOUT_MS
    const idleTimeout =
        parseSecondsOption(url, 'max_idle_connection_lifetime', 'idleTimeout') ??
        DEFAULT_IDLE_TIMEOUT_SECONDS
    const socketTimeout = parseMillisecondsOption(url, 'socket_timeout', 'socketTimeout')
    const socketPath = getSearchParam(url, 'socket', 'socketPath')
    const compress = parseOptionalBoolean(getSearchParam(url, 'compress'))
    const ssl = createSslConfig(url)

    // Preserve Prisma v6-style DATABASE_URL behavior when using Prisma 7 driver adapters.
    return {
        host: url.hostname,
        port: url.port ? Number(url.port) : DEFAULT_MYSQL_PORT,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database,
        connectTimeout,
        acquireTimeout,
        idleTimeout,
        ...(connectionLimit !== undefined ? { connectionLimit } : {}),
        ...(socketTimeout !== undefined ? { socketTimeout } : {}),
        ...(socketPath ? { socketPath } : {}),
        ...(compress !== undefined ? { compress } : {}),
        ...(ssl !== undefined ? { ssl } : {}),
    }
}

function createMariaDbAdapter(databaseUrl: string) {
    return new PrismaMariaDb(createMariaDbConfig(databaseUrl))
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
