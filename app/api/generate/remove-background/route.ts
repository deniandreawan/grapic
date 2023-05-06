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
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
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
