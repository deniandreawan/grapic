import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { replicate } from "@/lib/replicate"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Gallery } from "@/components/gallery"
import { Icons } from "@/components/icons"

interface PredictionsPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Predictions",
}

async function getData({ id, userId }: { id: string; userId: string }) {
  const data = await replicate.predictions.get(id)
  const prediction = await replicate.wait(data, {
    interval: 10,
  })
  const userPrediction = await db.predictions.findFirst({
    where: {
      id: id!,
      userId: userId!,
    },
  })

  return { prediction, userPrediction }
}

export default async function PredictionsPage({
  params,
}: PredictionsPageProps) {
  const user = await getCurrentUser()
  const { prediction, userPrediction } = await getData({
    id: params.id,
    userId: user?.id!,
  })

  if (!user || !userPrediction) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  if (!prediction.output) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      {prediction && <Gallery data={prediction} />}
    </div>
  )
}
