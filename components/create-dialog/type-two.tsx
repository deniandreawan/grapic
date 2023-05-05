import { Input } from "@/components/ui/input"
import { DropZone, DropZoneProps } from "@/components/drop-zone"

interface TypeTwoProps extends DropZoneProps {
  prompt: string
  setPrompt: React.Dispatch<React.SetStateAction<string>>
}

export function TypeTwo({ prompt, setPrompt, data, setData }: TypeTwoProps) {
  return (
    <div className="space-y-4">
      <DropZone data={data} setData={setData} />
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt here"
      />
    </div>
  )
}
