import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export const metadata = {
  title: "Assets",
}

async function getData({ userId }: { userId: string }) {
  const data = await db.assets.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return data
}

export default async function ProjectsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const data = await getData({
    userId: user.id,
  })

  const dataTable =
    data.map((item) => ({
      id: item.id,
      output: item.url,
      title: item.title,
      created: String(item.createdAt),
      media: item.media.charAt(0).toUpperCase() + item.media.slice(1),
      creator: item.userId === user.id ? user.name : null,
    })) || []

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Assets"
        text={`You have ${data.length || 0} assets`}
      />
      <div className="grid gap-10">
        <DataTable columns={columns} data={dataTable} />
      </div>
    </DashboardShell>
  )
}
