import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { replicate } from "@/lib/replicate"

const generateSchema = z.object({
  key: z.string(),
  type: z.string(),
  prompt: z.string(),
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

    const output = await replicate.run(
      "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
      {
        input: {
          prompt: body.prompt,
          batch_size: 4,
        },
      }
    )

    if (output) {
      await db.projects.create({
        data: {
          user: {
            connect: {
              email: session.user.email as string,
            },
          },
          projectId: body.key,
          prompt: body.prompt,
          type: body.type,
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
