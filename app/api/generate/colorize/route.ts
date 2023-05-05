import * as z from "zod"

import { replicate } from "@/lib/replicate"

const generateSchema = z.object({
  image: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = generateSchema.parse(json)

    const output = await replicate.run(
      "tcjwbw/bigcolor:9451bfbf652b21a9bccc741e5c7046540faa5586cfa3aa45abc7dbb46151a4f7",
      {
        input: {
          image: body.image,
        },
      }
    )

    return new Response(JSON.stringify(output))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
