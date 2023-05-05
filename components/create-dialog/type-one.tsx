import { Textarea } from "@/components/ui/textarea"

interface TypeOneProps {
  prompt: string
  setPrompt: React.Dispatch<React.SetStateAction<string>>
}

export function TypeOne({ prompt, setPrompt }: TypeOneProps) {
  return (
    <div>
      <Textarea
        placeholder="Type your prompt here"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
    </div>
  )
}
