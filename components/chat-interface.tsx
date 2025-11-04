"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Zap } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { RetrievedSources } from "./retrieved-sources"
import { ExecException } from "child_process"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  // date: Date
  sources?: Source[]
}

interface Source {
  id: string
  title: string
  excerpt: string
  relevance: number
}

const MOCK_SOURCES: Source[] = [
  {
    id: "1",
    title: "Advanced RAG Systems",
    excerpt: "Retrieval-augmented generation (RAG) improves LLM responses by incorporating external knowledge...",
    relevance: 0.95,
  },
  {
    id: "2",
    title: "Vector Database Guide",
    excerpt: "Vector databases store embeddings for efficient similarity search and semantic retrieval...",
    relevance: 0.87,
  },
  {
    id: "3",
    title: "LLM Prompting Techniques",
    excerpt: "Effective prompting strategies enhance model performance and context utilization...",
    relevance: 0.78,
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      // date: Date.now(),
      content:
        "Hello! I'm your RAG assistant. I can answer questions by searching through relevant documents and providing sourced information. What would you like to know?",
      
      
    },

  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      // date: Date.now(),
      type: "user",
      content: input,
    }

    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt:userMessage
        }),
      });
      console.log(res.body);
    }catch(e) {
      console.log(e);
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: `I found relevant information about "${input}". Based on the retrieved documents, here's what I discovered: The search results indicate that this is an important topic with multiple authoritative sources available. The information has been cross-referenced across our knowledge base to ensure accuracy.`,
      sources: MOCK_SOURCES,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">RAG Assistant</h1>
            <p className="text-sm text-slate-400">Powered by retrieval & generation</p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Start a conversation</h2>
              <p className="text-slate-400 max-w-sm">Ask questions and get answers backed by sourced documents</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <ChatMessage message={message} />
              {message.sources && message.sources.length > 0 && <RetrievedSources sources={message.sources} />}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 flex gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question based on your documents..."
              disabled={isLoading}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 pr-12"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
