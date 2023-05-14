import * as z from "zod"

import { redis } from "@/lib/upstash"

const webhookSchema = z.object({
  output: z.any(),
  status: z.string(),
})

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const json = await req.json()
    const body = webhookSchema.parse(json)

    let response
    if (body.status === "succeeded") {
      response = await redis.set(params.id as string, {
        output: body.output,
      })
    } else if (body.status === "failed") {
      response = await redis.set(params.id as string, {
        failed: true,
      })
    } else {
      response = null
    }

    return new Response(JSON.stringify(response))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
