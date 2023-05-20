"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider"
import { Prediction } from "replicate"

import { forceDownload, getBase64FromUrl } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface PredictionProps extends Prediction {
  input: {
    img?: string
    image?: string
    input_image?: string
  }
}

export function Gallery({ data }: { data: PredictionProps }) {
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDownload, setIsDownload] = useState<boolean>(false)
  const router = useRouter()

  const version =
    "aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613"
  const output =
    typeof data.output === "string"
      ? data.output
      : version === data.version
      ? data.output[1]
      : data.output[0]

  const startIndex = output.indexOf("pbxt/") + 5
  const endIndex = output.indexOf("/out")
  const id = output.substring(startIndex, endIndex)

  useEffect(() => {
    if (data?.status === "succeeded" || data?.status === "failed") {
      setLoading(false)
    }
  }, [data?.status])

  async function onSubmit() {
    setIsSaving(true)

    await getBase64FromUrl(output).then(async (base64) => {
      const response = await fetch(`/api/project/${data.id}`, {
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
      {loading && data.status === "processing" && (
        <Icons.spinner className="h-8 w-8 animate-spin" />
      )}
      {!loading && data?.output && data.status === "succeeded" && (
        <div className="relative">
          {data.input.img || data.input.image || data.input.input_image ? (
            <ReactCompareSlider
              portrait={false}
              onlyHandleDraggable
              itemOne={
                <ReactCompareSliderImage
                  src={
                    data.input.img || data.input.image || data.input.input_image
                  }
                  alt="original photo"
                />
              }
              itemTwo={
                <ReactCompareSliderImage src={output} alt="restored photo" />
              }
              className="flex h-full w-[500px] rounded-xl object-cover"
            />
          ) : (
            <Image
              src={output}
              width="0"
              height="0"
              sizes="100vw"
              className="flex h-full w-[500px] rounded-xl object-cover"
              alt={data.id}
            />
          )}

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
                    fetch(output, {
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
        </div>
      )}
      {!loading && data?.status === "failed" && <p>Failed</p>}
    </div>
  )
}
