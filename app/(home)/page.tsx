import { dataContent } from "@/config/data-content"
import { Content } from "@/components/content"

export default function IndexPage() {
  return (
    <div className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {dataContent.map((item) => (
        <Content
          key={item.slug}
          title={item.title}
          descriptions={item.descriptions}
          thumbnail={item.thumbnail}
          slug={item.slug}
        />
      ))}
    </div>
  )
}
