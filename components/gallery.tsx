"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import useSWR from "swr"

import { DataProps } from "@/lib/upstash"
import { fetcher } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function Gallery({
  id,
  fallbackData,
}: {
  id: string
  fallbackData: DataProps
}) {
  const { data } = useSWR<DataProps>(`/api/generate/results/${id}`, fetcher, {
    fallbackData,
    refreshInterval: Boolean(fallbackData.output) ? 0 : 500,
    refreshWhenHidden: true,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data?.output) {
      setLoading(false)
    }
  }, [data?.output])

  return (
    <div>
      {loading && !data?.output && (
        <Icons.spinner className="h-8 w-8 animate-spin" />
      )}
      {!loading && data?.output && (
        <div>
          <Image
            src={typeof data.output === "string" ? data.output : data.output[0]}
            alt=""
            className="rounded-lg object-cover"
            width={400}
            height={400}
            priority
          />
        </div>
      )}
      {!loading && data?.failed && <p>Failed</p>}
    </div>
  )
}
