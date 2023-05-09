import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { generate } from "@/lib/generate"
import { replicate } from "@/lib/replicate"

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
})

const generateSchema = z.object({
  key: z.string(),
  type: z.string(),
  image: z.string().optional(),
  img: z.string().optional(),
  prompt: z.string().optional(),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = generateSchema.parse(json)

    switch (params.slug) {
      case "text-to-image":
        await generate({
          output: await replicate.run(
            "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
            {
              input: {
                prompt: body.prompt,
                batch_size: 4,
              },
            }
          ),
          email: session.user.email,
          key: body.key,
          type: body.type,
          prompt: body.prompt,
        })

        return new Response(JSON.stringify(body.key))
      case "image-to-image":
        await generate({
          output: await replicate.run(
            "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
            {
              input: {
                image: body.image,
                prompt: body.prompt,
                num_outputs: 4,
              },
            }
          ),
          email: session.user.email,
          key: body.key,
          type: body.type,
          prompt: body.prompt,
          image: body.image,
        })

        return new Response(JSON.stringify(body.key))

      case "colorize":
        await generate({
          output: await replicate.run(
            "tcjwbw/bigcolor:9451bfbf652b21a9bccc741e5c7046540faa5586cfa3aa45abc7dbb46151a4f7",
            {
              input: {
                image: body.image,
              },
            }
          ),
          email: session.user.email,
          key: body.key,
          type: body.type,
          image: body.image,
        })

        return new Response(JSON.stringify(body.key))

      case "remove-background":
        await generate({
          output: await replicate.run(
            "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
            {
              input: {
                image: body.image,
              },
            }
          ),
          email: session.user.email,
          key: body.key,
          type: body.type,
          image: body.image,
        })

        return new Response(JSON.stringify(body.key))
      case "upscale-image":
        await generate({
          output: await replicate.run(
            "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
            {
              input: {
                img: body.img,
              },
            }
          ),
          email: session.user.email,
          key: body.key,
          type: body.type,
          image: body.img,
        })

        return new Response(JSON.stringify(body.key))
      default:
        return new Response(null, { status: 403 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
