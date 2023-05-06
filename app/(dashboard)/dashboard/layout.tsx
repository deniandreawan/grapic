import { notFound } from "next/navigation"

import { sideBarConfig } from "@/config/side-bar"
import { getCurrentUser } from "@/lib/session"
import { Sidebar } from "@/components/side-bar"
import { SiteHeader } from "@/components/site-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <SiteHeader
        user={{
          name: user.name,
          image: user.image,
          email: user.email,
        }}
      />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <Sidebar items={sideBarConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
