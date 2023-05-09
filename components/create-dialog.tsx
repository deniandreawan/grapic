"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DataContent } from "@/types"

import { EnumComponent } from "@/config/data-content"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropZone } from "@/components/drop-zone"
import { Icons } from "@/components/icons"

interface CreateDialogProps extends DataContent {
  children: React.ReactNode
}

export function CreateDialog(item: CreateDialogProps) {
  const router = useRouter()
  const [data, setData] = React.useState<{
    image: string | null
  }>({
    image: null,
  })
  const [prompt, setPrompt] = React.useState<string>("")
  const [saving, setSaving] = React.useState<boolean>(false)

  const saveDisabled = React.useMemo(() => {
    if (item.slug === "text-to-image") {
      return !prompt || saving
    } else if (item.slug === "image-to-image") {
      return !prompt || !data.image || saving
    } else {
      return !data.image || saving
    }
  }, [data.image, prompt, saving, item.slug])

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
      const data = await fetch(api, {
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

      return data
    },
    [router]
  )

  const onClose = React.useCallback(() => {
    setPrompt("")
    setData({ image: null })
  }, [setPrompt, setData])

  const onGenerate = React.useCallback(async () => {
    setSaving(true)

    switch (item.slug) {
      case "upscale-image":
        await getFetch({
          api: `/api/generate/${item.slug}`,
          type: item.slug,
          input: { img: data.image },
        })
        break
      case "image-to-image":
        await getFetch({
          api: `/api/generate/${item.slug}`,
          type: item.slug,
          input: { image: data.image, prompt },
        })
      case "text-to-image":
        await getFetch({
          api: `/api/generate/${item.slug}`,
          type: item.slug,
          input: { prompt },
        })
        break
      default:
        await getFetch({
          api: `/api/generate/${item.slug}`,
          type: item.slug,
          input: { image: data.image },
        })
        break
    }
  }, [data.image, getFetch, item.slug, prompt])

  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>{item.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>{item.descriptions}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {item.components.includes(EnumComponent.image) && (
            <DropZone data={data} setData={setData} />
          )}
          {item.components.includes(EnumComponent.input) && (
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your prompt here"
            />
          )}
          {item.components.includes(EnumComponent.textarea) && (
            <Textarea
              placeholder="Type your prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          )}
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