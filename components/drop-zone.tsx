"use client"

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react"

import { Icons } from "@/components/icons"

export interface DropZoneProps {
  data: {
    image: string | null
  }
  setData: Dispatch<SetStateAction<{ image: string | null }>>
}

export function DropZone({ data, setData }: DropZoneProps) {
  const [fileSizeTooBig, setFileSizeTooBig] = useState(false)

  const [dragActive, setDragActive] = useState(false)

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFileSizeTooBig(false)
      const file = event.currentTarget.files && event.currentTarget.files[0]
      if (file) {
        if (file.size / 1024 / 1024 > 5) {
          setFileSizeTooBig(true)
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }))
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [setData]
  )

  return (
    <form>
      <div>
        <label
          htmlFor="image-upload"
          className="group relative flex h-72 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-900"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)
              setFileSizeTooBig(false)
              const file = e.dataTransfer.files && e.dataTransfer.files[0]
              if (file) {
                if (file.size / 1024 / 1024 > 5) {
                  setFileSizeTooBig(true)
                } else {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }))
                  }
                  reader.readAsDataURL(file)
                }
              }
            }}
          />
          <div
            className={`absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-slate-50 dark:bg-slate-900"
            }`}
          >
            <Icons.uploadCloud
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-slate-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
            />
            <p className="mt-2 text-center text-sm text-slate-500">
              Drag and drop or click to upload.
            </p>
            {fileSizeTooBig && (
              <p className="text-sm text-red-500">
                File size too big (max 5MB)
              </p>
            )}
            <span className="sr-only">Photo upload</span>
          </div>
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt="Preview"
              className="h-full w-full rounded-md object-contain"
            />
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>
    </form>
  )
}
