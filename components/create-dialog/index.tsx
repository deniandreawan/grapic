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
    return !data.image || !prompt || saving
  }, [data.image, prompt, saving])

  const onClose = React.useCallback(() => {
    setPrompt("")
    setData({ image: null })
  }, [setPrompt, setData])

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
          <Button type="submit" disabled={saveDisabled}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
