import { User, type Predictions } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/icons"

export interface DataContent {
  id: string
  thumbnail: string
  title: string
  descriptions: string
  version: string
  components: string[]
}

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SidebarConfig = {
  sidebarNav: SidebarNavItem[]
}

export type FeaturesItem = {
  icon: StaticImageData
  title: string
  descriptions: string
}

export type LandingConfig = {
  features: FeaturesItem[]
}

interface PredictionProps extends Predictions {
  output: string[] | string
  input: {
    img?: string
    image?: string
    input_image?: string
  }
}
