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
      "lambdal/stable-diffusion-image-variation:7c399ba0e1b33ed8ec39ed30eb6b0a2d9e054462543c428c251293034af82a8e",
      {
        input: {
          input_image: body.image,
          num_outputs: 4,
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
