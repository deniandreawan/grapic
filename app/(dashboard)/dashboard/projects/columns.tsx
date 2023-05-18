"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

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
  updated: string
  creator: string | null | undefined
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "Project Name",
    cell: ({ row }) => {
      const data = row.original
      return (
        <div className="flex items-center space-x-6">
          {data.output && (
            <Image
              className="rounded-md object-cover"
              src={
                typeof data.output === "string" ? data.output : data.output[0]
              }
              alt=""
              width={50}
              height={50}
            />
          )}
          {data.title && <span>{data.title}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "creator",
    header: "Creator",
  },
  {
    accessorKey: "updated",
    header: "Updated",
    cell: ({ row }) => {
      const updated = String(row.getValue("updated"))
      const date = new Date(updated)

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
            <DropdownMenuItem
              onClick={() => router.push(`/results/${data.id}`)}
            >
              Open
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
