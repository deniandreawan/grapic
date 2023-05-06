import * as z from "zod"

import { replicate } from "@/lib/replicate"

export const config = {
  runtime: "edge",
}

const generateSchema = z.object({
  image: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = generateSchema.parse(json)

    const output = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: body.image,
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
