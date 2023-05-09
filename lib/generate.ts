import { env } from "process"

import { cloudflare } from "@/lib/cloudflare"
import { db } from "@/lib/db"

interface GenerateProps {
  output: object
  key: string
  prompt?: string
  image?: string
  type: string
  email: string | null | undefined
}

export async function generate({
  output,
  key,
  prompt,
  image,
  email,
  type,
}: GenerateProps) {
  if (image) {
    await cloudflare({ key, image })
  }

  if (output) {
    await db.projects.create({
      data: {
        user: {
          connect: {
            email: email!,
          },
        },
        projectId: key,
        type: type,
        prompt: prompt ? prompt : null,
        inputImage: image
          ? `${env.NEXT_PUBLIC_CLOUDFLARE_WORKER}/${key}`
          : null,
        outputImage: typeof output === "string" ? [output] : output,
      },
    })
  }
}
