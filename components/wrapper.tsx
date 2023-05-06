import * as React from "react"

import { cn } from "@/lib/utils"

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Wrapper({ children, className, ...props }: WrapperProps) {
  return (
    <div className={cn("grid items-start gap-8 pb-8", className)} {...props}>
      {children}
    </div>
  )
}
