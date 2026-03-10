import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/ai'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#F5C842] flex items-center justify-center text-[#1B2A4A] text-xs font-bold shrink-0 mr-2 mt-1">
          ET
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-[#1E6FBF] text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 text-[#2D2D2D] dark:text-gray-100 shadow-sm rounded-bl-sm border border-gray-100 dark:border-gray-700'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
