interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

const SUGGESTED_PROMPTS = [
  'How did I sleep?',
  'What should I focus on today?',
  'Why am I feeling tired?',
  'My stress is high lately',
  'How is my recovery?',
  'Give me a tip for better sleep',
]

export function SuggestedPrompts({ onSelect, disabled = false }: SuggestedPromptsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="shrink-0 px-3 py-1.5 rounded-full border border-[#1B2A4A]/20 dark:border-white/20 text-xs font-medium text-[#1B2A4A] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#1B2A4A] hover:text-white dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
