"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PredictionProps } from "@/types"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider"
import useSWR from "swr"

import { PredictionVersion } from "@/config/data-content"
import { fetcher, forceDownload, getBase64FromUrl } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

export function Gallery({ prediction }: { prediction: PredictionProps }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [loadImage, setLoadImage] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDownload, setIsDownload] = useState<boolean>(false)
  const router = useRouter()

  const { data } = useSWR<PredictionProps>(
    `/api/predictions/${prediction.id}`,
    fetcher,
    {
      refreshInterval:
        prediction.status === "succeeded" || prediction.status === "failed"
          ? 0
          : 500,
      refreshWhenHidden: true,
    }
  )

  useEffect(() => {
    if (data?.status === "succeeded" || data?.status === "failed") {
      setLoading(false)
    }
  }, [data?.status])

  const output =
    data && data.output && typeof data.output === "string"
      ? data.output
      : data && PredictionVersion.reimagine !== data.version
      ? data.output && data.output[0]
      : data && data.output && data.output[1]
  const startIndex = output && output.indexOf("pbxt/") + 5
  const endIndex = startIndex && output.indexOf("/out")
  const id =
    startIndex && endIndex && String(output).substring(startIndex, endIndex)

  async function onSubmit() {
    setIsSaving(true)

    await getBase64FromUrl(output!).then(async (base64) => {
      const response = await fetch(`/api/assets/${data?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled",
          outputId: id,
          output: base64,
          media: "image",
        }),
      })

      setIsSaving(false)

      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Please try again.",
          variant: "destructive",
        })
      }

      toast({
        description: "Success.",
      })

      router.refresh()
    })
  }

  return (
    <div>
      {loading && data?.status === "processing" && (
        <Icons.spinner className="h-8 w-8 animate-spin" />
      )}
      {!loading && data?.output && data.status === "succeeded" && (
        <div className="relative">
          {data.input.img || data.input.image || data.input.input_image ? (
            <div className="relative max-h-[400px] max-w-[500px]">
              <ReactCompareSlider
                portrait={false}
                onlyHandleDraggable
                itemOne={
                  <ReactCompareSliderImage
                    src={
                      data.input.img ||
                      data.input.image ||
                      data.input.input_image
                    }
                    alt="original photo"
                  />
                }
                itemTwo={
                  <Image
                    src={output!}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="h-auto w-[500px] rounded-xl object-cover"
                    alt={data.id}
                    onLoadingComplete={() => setLoadImage(false)}
                  />
                }
                className="h-auto w-[500px] rounded-xl object-cover"
              />
            </div>
          ) : (
            <div className="relative max-h-[400px] max-w-[500px]">
              <Image
                src={output!}
                width="0"
                height="0"
                sizes="100vw"
                className="h-auto w-[500px] rounded-xl object-cover"
                alt={data.id}
                onLoadingComplete={() => setLoadImage(false)}
              />
            </div>
          )}

          {!loadImage && (
            <div className="absolute right-3 top-3 flex items-center justify-center space-x-2">
              <button
                onClick={onSubmit}
                className="flex h-full w-full items-center justify-center rounded-full bg-slate-50/80 p-2 text-xl hover:cursor-pointer hover:bg-slate-50"
              >
                {isSaving ? (
                  <Icons.spinner className="h-4 w-4 animate-spin text-slate-600" />
                ) : (
                  <Icons.folder className="h-4 w-4 text-slate-600" />
                )}
              </button>
              <button className="flex h-full w-full items-center justify-center rounded-full bg-slate-50/80 p-2 text-xl hover:cursor-pointer hover:bg-slate-50">
                {isDownload ? (
                  <Icons.spinner className="h-4 w-4 animate-spin text-slate-600" />
                ) : (
                  <Icons.download
                    className="h-4 w-4 text-slate-600"
                    onClick={() => {
                      setIsDownload(true)
                      fetch(output!, {
                        headers: new Headers({
                          Origin: location.origin,
                        }),
                        mode: "cors",
                      })
                        .then((response) => response.blob())
                        .then((blob) => {
                          let blobUrl = window.URL.createObjectURL(blob)
                          forceDownload(blobUrl, `output`)
                          setIsDownload(false)
                        })
                        .catch((e) => console.error(e))
                    }}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      )}
      {!loading && data?.status === "failed" && <p>Failed</p>}
    </div>
  )
}
