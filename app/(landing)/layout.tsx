import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

interface LandingLayoutProps {
  children: React.ReactNode
}

export default async function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container absolute inset-x-0 top-0 z-40 bg-transparent">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav />
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }), "px-4")}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl flex-1 px-6 md:px-12 xl:px-6">
        {children}
      </main>
    </div>
  )
}
