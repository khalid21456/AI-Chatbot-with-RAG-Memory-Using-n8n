import { User } from "lucide-react"

interface Message {
  type: "user" | "assistant"
  content: string
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.type === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
          isUser ? "bg-slate-700 text-slate-300" : "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : "AI"}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-2xl ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block px-4 py-3 rounded-lg ${
            isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-800 text-slate-100 rounded-bl-none"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  )
}
