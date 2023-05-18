import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export const metadata = {
  title: "Projects",
}

async function getData({ userId }: { userId: string }) {
  const data = await db.projects.findMany({
    where: {
      userId,
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
      id: item.projectId,
      output: item.output,
      title: item.title,
      updated: String(item.updatedAt),
      creator: item.userId === user.id ? user.name : null,
    })) || []

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Projects"
        text={`You have ${data.length || 0} projects`}
      />
      <div className="grid gap-10">
        <DataTable columns={columns} data={dataTable} />
      </div>
    </DashboardShell>
  )
}
