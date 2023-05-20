import { getServerSession } from "next-auth/next"
import { Prediction } from "replicate"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { replicate } from "@/lib/replicate"

const generateSchema = z.object({
  prompt: z.string().optional(),
  image: z.string().optional(),
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
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authentication and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = generateSchema.parse(json)
    let prediction: Prediction

    switch (params.id) {
      case "text-to-image":
        prediction = await replicate.predictions.create({
          version:
            "601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
          input: {
            image: body.image,
            prompt: body.prompt,
            width: 768,
            height: 768,
          },
        })

        if (prediction) {
          await db.predictions.create({
            data: {
              user: {
                connect: {
                  email: session.user.email!,
                },
              },
              id: prediction.id,
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case "image-instruction":
        prediction = await replicate.predictions.create({
          version:
            "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
          input: {
            prompt: body.prompt,
            image: body.image,
            scheduler: "K_EULER_ANCESTRAL",
            guidance_scale: 10,
            num_inference_steps: 50,
            image_guidance_scale: 1,
          },
        })

        if (prediction) {
          await db.predictions.create({
            data: {
              user: {
                connect: {
                  email: session.user.email!,
                },
              },
              id: prediction.id,
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case "colorize":
        prediction = await replicate.predictions.create({
          version:
            "9451bfbf652b21a9bccc741e5c7046540faa5586cfa3aa45abc7dbb46151a4f7",
          input: {
            image: body.image,
          },
        })

        if (prediction) {
          await db.predictions.create({
            data: {
              user: {
                connect: {
                  email: session.user.email!,
                },
              },
              id: prediction.id,
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case "remove-background":
        prediction = await replicate.predictions.create({
          version:
            "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
          input: {
            image: body.image,
          },
        })

        if (prediction) {
          await db.predictions.create({
            data: {
              user: {
                connect: {
                  email: session.user.email!,
                },
              },
              id: prediction.id,
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case "super-resolution":
        prediction = await replicate.predictions.create({
          version:
            "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
          input: {
            img: body.image,
          },
        })

        if (prediction) {
          await db.predictions.create({
            data: {
              user: {
                connect: {
                  email: session.user.email!,
                },
              },
              id: prediction.id,
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

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
