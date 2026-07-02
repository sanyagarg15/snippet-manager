import { FileCode } from 'lucide-react'
import type { Snippet, SnippetId } from '@/types/snippet.types'
import { SnippetListItem } from '@/components/snippets/SnippetListItem'
import { EmptyState } from '@/components/common/EmptyState'

interface SnippetListProps {
  snippets: Snippet[]
  activeId?: SnippetId
}

export function SnippetList({ snippets, activeId }: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <EmptyState
        icon={<FileCode size={28} />}
        title="No snippets found"
        description="Try clearing filters or create a new snippet."
      />
    )
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto p-2">
      {snippets.map((snippet) => (
        <SnippetListItem key={snippet.id} snippet={snippet} active={snippet.id === activeId} />
      ))}
    </div>
  )
}
