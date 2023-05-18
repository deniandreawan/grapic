"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Project {
  id: string
  output: any
  title: string
  created: string
  media: string
  type: string
  creator: string | null | undefined
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ row }) => {
      const data = row.original
      return (
        <div className="flex items-center space-x-6">
          {data.output && (
            <div className="relative h-12 w-12">
              <Image
                className="rounded-md bg-slate-50 object-cover dark:bg-slate-800"
                src={
                  typeof data.output === "string" ? data.output : data.output[0]
                }
                alt=""
                fill
              />
            </div>
          )}
          {data.title && <span>{data.title}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = String(row.getValue("type"))
      return <Badge>{type}</Badge>
    },
  },
  {
    accessorKey: "media",
    header: "Media",
  },
  {
    accessorKey: "creator",
    header: "Creator",
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => {
      const created = String(row.getValue("created"))
      const date = new Date(created)

      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }
      const formattedDate: string = date.toLocaleDateString("en-GB", options)

      return formattedDate
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
