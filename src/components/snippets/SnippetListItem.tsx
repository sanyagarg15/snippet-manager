import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import type { Snippet } from '@/types/snippet.types'
import { SNIPPET_LANGUAGES } from '@/types/snippet.types'

interface SnippetListItemProps {
  snippet: Snippet
  active: boolean
}

export function SnippetListItem({ snippet, active }: SnippetListItemProps) {
  const languageLabel = SNIPPET_LANGUAGES.find((l) => l.value === snippet.language)?.label ?? snippet.language

  return (
    <Link
      to="/snippets/$id"
      params={{ id: snippet.id }}
      className={`block rounded-lg border px-3 py-2.5 transition-colors ${
        active
          ? 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-500/10'
          : 'border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{snippet.title}</p>
        {snippet.favorite && <Star size={13} className="mt-0.5 shrink-0 fill-amber-400 text-amber-400" />}
      </div>
      {snippet.description && (
        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">{snippet.description}</p>
      )}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:text-zinc-400">
          {languageLabel}
        </span>
        {snippet.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[11px] text-zinc-400">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
