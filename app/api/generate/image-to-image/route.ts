import * as z from "zod"

import { replicate } from "@/lib/replicate"

export const config = {
  runtime: "edge",
}

const generateSchema = z.object({
  image: z.string(),
  prompt: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = generateSchema.parse(json)

    const output = await replicate.run(
      "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
      {
        input: {
          image: body.image,
          prompt: body.prompt,
          num_samples: 4,
          a_prompt: "best quality, extremely detailed",
          n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
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
