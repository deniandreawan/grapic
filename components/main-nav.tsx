import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="w-10" />
        <span className="font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
    </div>
  )
}
