import Image from "next/image"
import { DataContent } from "@/types"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CreateDialog } from "@/components/create-dialog"

export function Content(item: DataContent) {
  return (
    <CreateDialog {...item}>
      <Card className="cursor-pointer">
        <CardHeader className="space-y-4 p-4">
          <AspectRatio ratio={4 / 3} className="bg-muted">
            <Image
              priority
              src={item.thumbnail}
              alt={item.slug}
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
          <div className="space-y-1 pb-2">
            <CardTitle className="text-md">{item.title}</CardTitle>
            <CardDescription>{item.descriptions}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </CreateDialog>
  )
}
