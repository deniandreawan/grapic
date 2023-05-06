import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        // This is optional because it's only used in development.
        // See https://next-auth.js.org/deployment.
        REPLICATE_API_TOKEN: z.string().min(1),
        NEXTAUTH_URL: z.string().url().optional(),
        NEXTAUTH_SECRET: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        POSTGRES_PRISMA_URL: z.string().min(1),
        POSTGRES_URL_NON_POOLING: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string().min(1),
    },
    runtimeEnv: {
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
})