import { DropZone, DropZoneProps } from "@/components/drop-zone"

export function TypeThree({ data, setData }: DropZoneProps) {
  return (
    <div>
      <DropZone data={data} setData={setData} />
    </div>
  )
}
