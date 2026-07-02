import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { snippetsRepository } from '@/lib/storage/snippets.repository'
import { queryKeys } from '@/lib/query/keys'
import type { CreateSnippetPayload, Snippet, SnippetId, UpdateSnippetPayload } from '@/types/snippet.types'

export function useSnippetsQuery() {
  return useQuery({
    queryKey: queryKeys.snippets.list(),
    queryFn: snippetsRepository.list,
  })
}

export function useSnippetQuery(id: SnippetId | undefined) {
  return useQuery({
    queryKey: queryKeys.snippets.detail(id ?? ('' as SnippetId)),
    queryFn: () => snippetsRepository.get(id as SnippetId),
    enabled: !!id,
  })
}

export function useCreateSnippetMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSnippetPayload) => snippetsRepository.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.list() })
    },
  })
}

export function useUpdateSnippetMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: SnippetId; payload: UpdateSnippetPayload }) =>
      snippetsRepository.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.list() })
      queryClient.setQueryData(queryKeys.snippets.detail(updated.id), updated)
    },
  })
}

export function useDeleteSnippetMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: SnippetId) => snippetsRepository.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.list() })
    },
  })
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: SnippetId) => snippetsRepository.toggleFavorite(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.snippets.list() })
      const previous = queryClient.getQueryData<Snippet[]>(queryKeys.snippets.list())
      queryClient.setQueryData<Snippet[]>(queryKeys.snippets.list(), (old) =>
        old?.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)),
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.snippets.list(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.list() })
    },
  })
}
