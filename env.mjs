import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        // This is optional because it's only used in development.
        // See https://next-auth.js.org/deployment.
        REPLICATE_API_TOKEN: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string().min(1),
    },
    runtimeEnv: {
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
})