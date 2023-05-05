import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { CreateDialog } from "./create-dialog"

interface ContentProps {
  thumbnail: string
  title: string
  descriptions: string
  slug: string
}

export function Content({
  thumbnail,
  title,
  descriptions,
  slug,
}: ContentProps) {
  return (
    <CreateDialog slug={slug} title={title} description={descriptions}>
      <Card className="cursor-pointer lg:duration-300 lg:hover:scale-105">
        <CardHeader className="space-y-4 p-4">
          <AspectRatio ratio={4 / 3} className="bg-muted">
            <Image
              priority
              src={thumbnail}
              alt={slug}
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
          <div className="space-y-1 pb-2">
            <CardTitle className="text-md">{title}</CardTitle>
            <CardDescription>{descriptions}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </CreateDialog>
  )
}
