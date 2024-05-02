import 'dotenv/config'
import { randomUUID } from 'crypto'
import { Environment } from 'vitest'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  const envDataBaseURL = process.env.DATABASE_URL

  if (!envDataBaseURL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(envDataBaseURL)

  url.searchParams.set('schema', schema)

  return url.toString()

}

export default <Environment>{
  name: 'prisma',
  transformMode: "ssr",
  setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    // usar migrate deploy para não procurar novas migrations
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await prisma.$disconnect()
      },
    }
  },
}