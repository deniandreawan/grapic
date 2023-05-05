import { SiteHeader } from "@/components/site-header"
import { Wrapper } from "@/components/wrapper"

interface HomeLayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 bg-slate-50 dark:bg-slate-900">
        <Wrapper className="py-10">{children}</Wrapper>
      </div>
    </div>
  )
}
