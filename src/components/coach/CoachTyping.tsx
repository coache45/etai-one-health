export function CoachTyping() {
  return (
    <div className="flex justify-start">
      <div className="w-7 h-7 rounded-full bg-[#F5C842] flex items-center justify-center text-[#1B2A4A] text-xs font-bold shrink-0 mr-2">
        ET
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#1B2A4A] dark:bg-[#F5C842] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#1B2A4A] dark:bg-[#F5C842] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#1B2A4A] dark:bg-[#F5C842] animate-bounce" />
        </div>
      </div>
    </div>
  )
}
