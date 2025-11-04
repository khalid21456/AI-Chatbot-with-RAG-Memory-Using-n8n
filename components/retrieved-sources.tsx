import { FileText, TrendingUp } from "lucide-react"

interface Source {
  id: string
  title: string
  excerpt: string
  relevance: number
}

export function RetrievedSources({ sources }: { sources: Source[] }) {
  return (
    <div className="ml-11 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
        <FileText className="w-4 h-4" />
        <span>Sources</span>
      </div>
      <div className="space-y-2">
        {sources.map((source) => (
          <div
            key={source.id}
            className="group bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                {source.title}
              </h4>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">{Math.round(source.relevance * 100)}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{source.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
