import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  UserAccountNav,
  UserAccountNavProps,
} from "@/components/user-account-nav"

interface UserProps extends UserAccountNavProps {
  credits: number
}

export function SiteHeader({ user, credits }: UserProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Badge>{credits || 0} Credits</Badge>
            <ThemeToggle />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </nav>
        </div>
      </div>
    </header>
  )
}
