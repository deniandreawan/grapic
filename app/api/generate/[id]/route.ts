import { env } from "@/env.mjs"
import { getServerSession } from "next-auth/next"
import { Prediction } from "replicate"
import * as z from "zod"

import { PredictionId, PredictionVersion } from "@/config/data-content"
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
  // Validate the route params.
  const { params } = routeContextSchema.parse(context)

  // Ensure user is authentication and has access to this user.
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response(null, { status: 403 })
  }

  try {
    const json = await req.json()
    const body = generateSchema.parse(json)
    let prediction: Prediction
    const domain: string =
      process.env.NODE_ENV !== "production"
        ? "https://bd8d-36-68-55-61.ngrok-free.app"
        : env.NEXT_PUBLIC_APP_URL

    // Get user from DB
    const user = await db.user.findUnique({
      where: {
        email: session.user.email!,
      },
      select: {
        credits: true,
      },
    })

    // Check if user has any credits left
    if (user?.credits === 0) {
      return new Response(JSON.stringify("You have no generations left"), {
        status: 400,
      })
    }

    // If they have credits, decrease their credits by one and continue
    await db.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    })

    switch (params.id) {
      case PredictionId.textToImage:
        prediction = await replicate.predictions.create({
          version: PredictionVersion.textToImage,
          input: {
            image: body.image,
            prompt: body.prompt,
            width: 768,
            height: 768,
          },
          webhook: `${domain}/api/webhook/replicate?token=${env.NEXTAUTH_SECRET}`,
          webhook_events_filter: ["completed"],
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
              type: PredictionId.textToImage,
              version: PredictionVersion.textToImage,
              media: "image",
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case PredictionId.imageInstruction:
        prediction = await replicate.predictions.create({
          version: PredictionVersion.imageInstruction,
          input: {
            prompt: body.prompt,
            image: body.image,
            scheduler: "K_EULER_ANCESTRAL",
            guidance_scale: 10,
            num_inference_steps: 50,
            image_guidance_scale: 1,
          },
          webhook: `${domain}/api/webhook/replicate?token=${env.NEXTAUTH_SECRET}`,
          webhook_events_filter: ["completed"],
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
              type: PredictionId.imageInstruction,
              version: PredictionVersion.imageInstruction,
              media: "image",
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case PredictionId.superResolution:
        prediction = await replicate.predictions.create({
          version: PredictionVersion.superResolution,
          input: {
            img: body.image,
          },
          webhook: `${domain}/api/webhook/replicate?token=${env.NEXTAUTH_SECRET}`,
          webhook_events_filter: ["completed"],
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
              type: PredictionId.superResolution,
              version: PredictionVersion.superResolution,
              media: "image",
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case PredictionId.removeBackground:
        prediction = await replicate.predictions.create({
          version: PredictionVersion.removeBackground,
          input: {
            image: body.image,
          },
          webhook: `${domain}/api/webhook/replicate?token=${env.NEXTAUTH_SECRET}`,
          webhook_events_filter: ["completed"],
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
              type: PredictionId.removeBackground,
              version: PredictionVersion.removeBackground,
              media: "image",
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case PredictionId.colorize:
        prediction = await replicate.predictions.create({
          version: PredictionVersion.colorize,
          input: {
            input_image: body.image,
            model_name: "Artistic",
          },
          webhook: `${domain}/api/webhook/replicate?token=${env.NEXTAUTH_SECRET}`,
          webhook_events_filter: ["completed"],
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
              type: PredictionId.colorize,
              version: PredictionVersion.colorize,
              media: "image",
            },
          })
        }

        return new Response(JSON.stringify({ id: prediction.id }))

      case PredictionId.reimagine:
        prediction = await replicate.predictions.create({
          version: PredictionVersion.reimagine,
          input: {
            image: body.image,
            prompt: body.prompt ? body.prompt : "",
            a_prompt: "best quality, extremely detailed",
            n_prompt:
              "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
          },
          webhook: `${domain}/api/webhook/replicate?token=${env.NEXTAUTH_SECRET}`,
          webhook_events_filter: ["completed"],
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
              type: PredictionId.reimagine,
              version: PredictionVersion.reimagine,
              media: "image",
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

    // Increment their credit if something went wrong
    await db.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        credits: {
          increment: 1,
        },
      },
    })

    return new Response(null, { status: 500 })
  }
}
