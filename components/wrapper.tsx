import { ReactNode } from "react"

export function Wrapper({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`mx-auto w-full max-w-screen-xl px-6 md:px-20 ${className}`}
    >
      {children}
    </div>
  )
}
