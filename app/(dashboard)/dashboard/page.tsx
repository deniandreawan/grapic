import { dataContent } from "@/config/data-content"
import { Content } from "@/components/content"
import { Wrapper } from "@/components/wrapper"

export default function DashboardPage() {
  return (
    <Wrapper>
      <div className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dataContent.map((item) => (
          <Content key={item.slug} {...item} />
        ))}
      </div>
    </Wrapper>
  )
}
