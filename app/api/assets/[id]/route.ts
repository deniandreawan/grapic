import { env } from "@/env.mjs"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { cloudflare } from "@/lib/cloudflare"
import { db } from "@/lib/db"

const assetsSchema = z.object({
  title: z.string(),
  outputId: z.string(),
  output: z.string(),
  media: z.enum(["image", "video", "audio"]),
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
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authentication and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = assetsSchema.parse(json)

    await cloudflare({ id: body.outputId, image: body.output })
      .then(async () => {
        await db.assets.create({
          data: {
            user: {
              connect: {
                email: session.user.email!,
              },
            },
            id: params.id,
            title: body.title,
            url: `${env.NEXT_PUBLIC_CLOUDFLARE_WORKER}/assets/${body.outputId}`,
            media: body.media,
          },
        })
      })
      .catch((err) => {
        return new Response(JSON.stringify(err), { status: 405 })
      })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
