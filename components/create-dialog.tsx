"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DataContent } from "@/types"

import { EnumComponent, PredictionId } from "@/config/data-content"
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
    if (item.id === PredictionId.textToImage) {
      return !prompt || saving
    } else if (item.id === PredictionId.imageInstruction) {
      return !prompt || !data.image || saving
    } else {
      return !data.image || saving
    }
  }, [data.image, prompt, saving, item.id])

  const getFetch = React.useCallback(
    async ({ api, input }: { api: string; input: object }) => {
      const data = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...input,
        }),
      }).then(async (res) => {
        if (res.status === 200) {
          const { id } = await res.json()

          if (id) {
            router.push(`/predictions/${id}`)
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

    switch (item.id) {
      case PredictionId.imageInstruction:
        await getFetch({
          api: `/api/generate/${item.id}`,
          input: { prompt, image: data.image },
        })
        break

      case PredictionId.reimagine:
        await getFetch({
          api: `/api/generate/${item.id}`,
          input: { prompt, image: data.image },
        })
        break
      case PredictionId.textToImage:
        await getFetch({
          api: `/api/generate/${item.id}`,
          input: { prompt },
        })
        break
      default:
        await getFetch({
          api: `/api/generate/${item.id}`,
          input: { image: data.image },
        })
        break
    }
  }, [data.image, getFetch, item.id, prompt])

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
