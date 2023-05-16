import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Gallery } from "@/components/gallery"
import { Icons } from "@/components/icons"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Result",
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const data = await db.projects.findFirst({
    where: {
      projectId: params.id,
      userId: user.id!,
    },
    select: {
      projectId: true,
      status: true,
    },
  })

  if (!data) {
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
      {data && <Gallery id={data.projectId} status={data.status} />}
    </div>
  )
}
