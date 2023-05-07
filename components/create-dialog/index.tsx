"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { setRandomKey } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TypeOne, TypeThree, TypeTwo } from "@/components/create-dialog/type"
import { Icons } from "@/components/icons"

interface CreateDialogProps {
  children: React.ReactNode
  title: string
  description: string
  slug: string
}

export function CreateDialog({
  children,
  title,
  description,
  slug,
}: CreateDialogProps) {
  const router = useRouter()
  const [data, setData] = React.useState<{
    image: string | null
  }>({
    image: null,
  })
  const [prompt, setPrompt] = React.useState<string>("")
  const [saving, setSaving] = React.useState<boolean>(false)

  const saveDisabled = React.useMemo(() => {
    if (slug === "text-to-image") {
      return !prompt || saving
    } else if (slug === "image-to-image") {
      return !prompt || !data.image || saving
    } else {
      return !data.image || saving
    }
  }, [data.image, prompt, saving, slug])

  const getFetch = React.useCallback(
    async ({
      api,
      type,
      input,
    }: {
      api: string
      type: string
      input: object
    }) => {
      const { key } = await setRandomKey()
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          type,
          ...input,
        }),
      }).then(async (res) => {
        if (res.status === 200) {
          const data = await res.json()

          if (data) {
            // This forces a cache invalidation.
            router.refresh()

            router.push(`/results/${key}`)
          }
        } else {
          setSaving(false)
          alert("Something went wrong. Please try again later.")
        }
      })

      return response
    },
    [router]
  )

  const onClose = React.useCallback(() => {
    setPrompt("")
    setData({ image: null })
  }, [setPrompt, setData])

  const onGenerate = React.useCallback(async () => {
    setSaving(true)

    switch (slug) {
      case "text-to-image":
        await getFetch({
          api: "/api/generate/text-to-image",
          type: "text-to-image",
          input: { prompt },
        })
        break
      case "image-to-image":
        await getFetch({
          api: "/api/generate/image-to-image",
          type: "image-to-image",
          input: { image: data.image, prompt },
        })
        break
      case "upscale-image":
        await getFetch({
          api: "/api/generate/upscale-image",
          type: "upscale-image",
          input: { img: data.image },
        })
        break
      case "remove-background":
        await getFetch({
          api: "/api/generate/remove-background",
          type: "remove-background",
          input: { image: data.image },
        })
        break
      case "colorize":
        await getFetch({
          api: "/api/generate/colorize",
          type: "colorize",
          input: { image: data.image },
        })
        break
      default:
        break
    }
  }, [data.image, getFetch, prompt, slug])

  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {(slug === "text-to-image" && (
            <TypeOne prompt={prompt} setPrompt={setPrompt} />
          )) ||
            (slug === "image-to-image" && (
              <TypeTwo
                prompt={prompt}
                setPrompt={setPrompt}
                data={data}
                setData={setData}
              />
            )) ||
            (slug === "upscale-image" && (
              <TypeThree data={data} setData={setData} />
            )) ||
            (slug === "remove-background" && (
              <TypeThree data={data} setData={setData} />
            )) ||
            (slug === "colorize" && (
              <TypeThree data={data} setData={setData} />
            ))}
        </div>

        <DialogFooter>
          <Button type="submit" onClick={onGenerate} disabled={saveDisabled}>
            {saving ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
