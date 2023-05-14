import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getData } from "@/lib/upstash"

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
})

export async function GET(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authentication and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(null, { status: 403 })
    }

    const data = await getData(params.id)

    if (data) {
      await db.projects.updateMany({
        where: {
          userId: session.user.id,
          projectId: params.id,
        },
        data: {
          output:
            typeof data.output === "string" ? [data.output] : data.output!,
        },
      })
    }

    return new Response(JSON.stringify(data))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
