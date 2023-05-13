import { env } from "@/env.mjs"
import { Redis } from "@upstash/redis"
import { customAlphabet } from "nanoid"

// Initiate Redis instance
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
) // 7-character random string

export async function setRandomKey(): Promise<{ key: string }> {
  /* recursively set link till successful */
  const key = nanoid()
  const response = await redis.set(
    key,
    { output: null },
    {
      nx: true,
    }
  )
  if (response !== "OK") {
    // by the off chance that key already exists
    return setRandomKey()
  } else {
    return { key }
  }
}

export interface DataProps {
  output: string | null // output of prediction
  expired?: boolean // if the data is expired
  failed?: boolean // if the prediction failed
}

export async function getData(id: string) {
  return await redis.get<DataProps>(id)
}
