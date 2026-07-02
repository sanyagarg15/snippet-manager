import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Code2, Moon, PanelLeftClose, PanelLeftOpen, Plus, Sun } from 'lucide-react'
import { useSnippetsQuery } from '@/lib/query/snippets.queries'
import { useTheme } from '@/hooks/useTheme'
import { useUiStore } from '@/store/ui.store'
import { SNIPPET_LANGUAGES } from '@/types/snippet.types'
import type { SnippetSearchParams } from '@/lib/validation/snippet.schema'

interface SidebarProps {
  search: SnippetSearchParams
  onSearchChange: (patch: Partial<SnippetSearchParams>) => void
}

export function Sidebar({ search, onSearchChange }: SidebarProps) {
  const { data: snippets = [] } = useSnippetsQuery()
  const { theme, toggleTheme } = useTheme()
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of snippets) {
      for (const tag of s.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [snippets])

  const languageCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of snippets) counts.set(s.language, (counts.get(s.language) ?? 0) + 1)
    return SNIPPET_LANGUAGES.filter((l) => counts.has(l.value)).map((l) => ({
      ...l,
      count: counts.get(l.value) ?? 0,
    }))
  }, [snippets])

  const activeTags = search.tags ?? []

  const toggleTagFilter = (tag: string) => {
    const next = activeTags.includes(tag) ? activeTags.filter((t) => t !== tag) : [...activeTags, tag]
    onSearchChange({ tags: next.length > 0 ? next : undefined })
  }

  const toggleLanguageFilter = (language: string) => {
    onSearchChange({ language: search.language === language ? undefined : language })
  }

  if (sidebarCollapsed) {
    return (
      <div className="flex w-14 flex-col items-center gap-4 border-r border-zinc-200 dark:border-zinc-800 py-4">
        <Code2 className="text-violet-500" size={22} />
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <PanelLeftOpen size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-64 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between px-4 py-4">
        <Link to="/snippets" className="flex items-center gap-2 font-semibold">
          <Code2 className="text-violet-500" size={20} />
          Snippets
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={15} />
          </button>
        </div>
      </div>

      <div className="px-3">
        <Link
          to="/snippets/new"
          className="flex items-center justify-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
        >
          <Plus size={15} />
          New snippet
        </Link>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-400">Languages</p>
        <div className="mt-2 flex flex-col gap-0.5">
          {languageCounts.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => toggleLanguageFilter(l.value)}
              className={`flex items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-colors ${
                search.language === l.value
                  ? 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{l.label}</span>
              <span className="text-xs text-zinc-400">{l.count}</span>
            </button>
          ))}
          {languageCounts.length === 0 && <p className="px-2 py-1 text-xs text-zinc-400">No snippets yet</p>}
        </div>

        {tagCounts.length > 0 && (
          <>
            <p className="mt-5 px-1 text-xs font-medium uppercase tracking-wide text-zinc-400">Tags</p>
            <div className="mt-2 flex flex-wrap gap-1.5 px-1">
              {tagCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTagFilter(tag)}
                  className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                    activeTags.includes(tag)
                      ? 'bg-violet-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {tag} · {count}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
