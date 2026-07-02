import { useMemo } from 'react'
import { createFileRoute, Outlet, useNavigate, useParams } from '@tanstack/react-router'
import { snippetSearchSchema, type SnippetSearchParams } from '@/lib/validation/snippet.schema'
import { useSnippetsQuery } from '@/lib/query/snippets.queries'
import { Sidebar } from '@/components/layout/Sidebar'
import { SnippetList } from '@/components/snippets/SnippetList'
import { SearchInput } from '@/components/common/SearchInput'
import type { SnippetId } from '@/types/snippet.types'

export const Route = createFileRoute('/snippets')({
  validateSearch: snippetSearchSchema,
  component: SnippetsLayout,
})

function SnippetsLayout() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { id: activeId } = useParams({ strict: false })
  const { data: snippets = [] } = useSnippetsQuery()

  const handleSearchChange = (patch: Partial<SnippetSearchParams>) => {
    navigate({ search: (prev) => ({ ...prev, ...patch }) })
  }

  const filtered = useMemo(() => {
    return snippets.filter((s) => {
      if (search.language && s.language !== search.language) return false
      if (search.tags && search.tags.length > 0 && !search.tags.every((t) => s.tags.includes(t))) return false
      if (search.q) {
        const q = search.q.toLowerCase()
        const haystack = `${s.title} ${s.description ?? ''} ${s.code}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [snippets, search])

  return (
    <>
      <Sidebar search={search} onSearchChange={handleSearchChange} />
      <div className="flex w-80 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
        <div className="p-3">
          <SearchInput value={search.q ?? ''} onChange={(q) => handleSearchChange({ q: q || undefined })} />
        </div>
        <SnippetList snippets={filtered} activeId={activeId as SnippetId | undefined} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </>
  )
}
