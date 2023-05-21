import { NextRequest } from "next/server"
import { env } from "@/env.mjs"
import * as z from "zod"

import { db } from "@/lib/db"

const webhookSchema = z.object({
  id: z.string(),
  status: z.enum(["failed", "succeeded", "processing"]),
  input: z.any(),
  output: z.any(),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const body = webhookSchema.parse(json)
    const token = req.nextUrl.searchParams.get("token")

    if (token !== env.NEXTAUTH_SECRET) {
      return new Response(null, { status: 403 })
    }

    if (body.status === "succeeded") {
      await db.predictions.updateMany({
        where: {
          id: body.id,
        },
        data: {
          status: "succeeded",
          input: body.input,
          output: body.output,
        },
      })
    } else if (body.status === "failed") {
      await db.predictions.updateMany({
        where: {
          id: body.id,
        },
        data: {
          status: "failed",
          input: body.input,
        },
      })
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
