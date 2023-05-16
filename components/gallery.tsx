"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { StatusProjects } from "@prisma/client"
import useSWR from "swr"

import { fetcher } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface DataProps {
  projectId: string
  status: StatusProjects
  output: string[] | string | null
}

export function Gallery({
  id,
  status,
}: {
  id: string
  status: StatusProjects
}) {
  const { data } = useSWR<DataProps>(`/api/results/${id}`, fetcher, {
    refreshInterval: status !== "processing" ? 0 : 500,
    refreshWhenHidden: true,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data?.status === "succeeded" || data?.status === "failed") {
      setLoading(false)
    }
  }, [data?.status])

  return (
    <div>
      {loading && status === "processing" && (
        <Icons.spinner className="h-8 w-8 animate-spin" />
      )}
      {!loading && data?.output && data.status === "succeeded" && (
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
      {!loading && data?.status === "failed" && <p>Failed</p>}
    </div>
  )
}
