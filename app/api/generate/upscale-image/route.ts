import { env } from "@/env.mjs"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { replicate } from "@/lib/replicate"

const generateSchema = z.object({
  key: z.string(),
  type: z.string(),
  img: z.string(),
})

export async function POST(req: Request) {
  try {
    // Ensure user is authentication and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = generateSchema.parse(json)

    const urlImage = `${env.NEXT_PUBLIC_CLOUDFLARE_WORKER}/${body.key}`

    const output = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: body.img,
        },
      }
    )

    const inputImage = await fetch(urlImage, {
      method: "PUT",
      headers: {
        "X-CF-Secret": env.CLOUDFLARE_WORKER_SECRET,
      },
      body: Uint8Array.from(atob(body.img.replace(/^data[^,]+,/, "")), (v) =>
        v.charCodeAt(0)
      ),
    })

    if (output && inputImage) {
      await db.projects.create({
        data: {
          user: {
            connect: {
              email: session.user.email as string,
            },
          },
          projectId: body.key,
          type: body.type,
          inputImage: urlImage,
          outputImage: typeof output === "string" ? [output] : output,
        },
      })
    }

    return new Response(JSON.stringify(body.key))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
