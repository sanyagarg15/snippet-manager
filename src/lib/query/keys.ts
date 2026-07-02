import type { SnippetId } from '@/types/snippet.types'

export const queryKeys = {
  snippets: {
    all: ['snippets'] as const,
    list: () => [...queryKeys.snippets.all, 'list'] as const,
    detail: (id: SnippetId) => [...queryKeys.snippets.all, 'detail', id] as const,
  },
}
