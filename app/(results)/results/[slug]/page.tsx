import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ResultsPageProps {
  params: {
    slug: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const user = await getCurrentUser()

  const data = await db.projects.findFirst({
    where: {
      userId: user?.id,
      projectId: params.slug,
    },
    select: {
      projectId: true,
      outputImage: true,
    },
  })

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const output: string[] = data?.outputImage as string[]

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

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        {data && output.length && (
          <div className="mx-auto grid grid-cols-2 gap-2">
            {output.map((item: string, index) => (
              <Image
                key={index}
                src={item}
                style={{ width: "auto", height: "auto" }}
                priority
                alt=""
                width={500}
                height={500}
                className="rounded-md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
