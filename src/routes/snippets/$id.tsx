import { createFileRoute } from '@tanstack/react-router'
import { useSnippetQuery } from '@/lib/query/snippets.queries'
import { SnippetDetail } from '@/components/snippets/SnippetDetail'
import { EmptyState } from '@/components/common/EmptyState'
import type { SnippetId } from '@/types/snippet.types'

export const Route = createFileRoute('/snippets/$id')({
  component: SnippetDetailPage,
})

function SnippetDetailPage() {
  const { id } = Route.useParams()
  const { data: snippet, isLoading } = useSnippetQuery(id as SnippetId)

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Loading…</div>
  }

  if (!snippet) {
    return <EmptyState title="Snippet not found" description="It may have been deleted." />
  }

  return <SnippetDetail key={snippet.id} snippet={snippet} />
}
