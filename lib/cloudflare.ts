import { env } from "@/env.mjs"

interface CloudflareProps {
  id: string
  image: string
}

export async function cloudflare({ id, image }: CloudflareProps) {
  await fetch(`${env.NEXT_PUBLIC_CLOUDFLARE_WORKER}/assets/${id}`, {
    method: "PUT",
    headers: {
      "X-CF-Secret": env.CLOUDFLARE_WORKER_SECRET,
    },
    body: Uint8Array.from(atob(image.replace(/^data[^,]+,/, "")), (v) =>
      v.charCodeAt(0)
    ),
  })
}
