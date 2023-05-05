"use client"

import * as React from "react"

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
import { TypeOne } from "@/components/create-dialog/type-one"
import { TypeThree } from "@/components/create-dialog/type-three"
import { TypeTwo } from "@/components/create-dialog/type-two"
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
    async ({ api, input }: { api: string; input: object }) => {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...input,
        }),
      }).then(async (res) => {
        if (res.status === 200) {
          const output = await res.json()

          console.log(output)
        } else {
          setSaving(false)
          alert("Something went wrong. Please try again later.")
        }
      })

      return response
    },
    []
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
          input: { prompt },
        })
        break
      case "image-to-image":
        await getFetch({
          api: "/api/generate/image-to-image",
          input: { prompt, image: data.image },
        })
        break
      case "image-variation":
        await getFetch({
          api: "/api/generate/image-variation",
          input: { input_image: data.image },
        })
        break
      case "upscale-image":
        await getFetch({
          api: "/api/generate/upscale-image",
          input: { img: data.image },
        })
        break
      case "remove-background":
        await getFetch({
          api: "/api/generate/remove-background",
          input: { image: data.image },
        })
        break
      case "colorize":
        await getFetch({
          api: "/api/generate/colorize",
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
            (slug === "image-variation" && (
              <TypeThree data={data} setData={setData} />
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
