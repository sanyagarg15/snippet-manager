import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Pencil, Star, Trash2 } from 'lucide-react'
import type { Snippet } from '@/types/snippet.types'
import { SNIPPET_LANGUAGES, highlighterLanguageFor } from '@/types/snippet.types'
import { CodeBlock } from '@/components/common/CodeBlock'
import { SnippetForm } from '@/components/snippets/SnippetForm'
import { useDeleteSnippetMutation, useToggleFavoriteMutation, useUpdateSnippetMutation } from '@/lib/query/snippets.queries'
import type { SnippetFormValues } from '@/lib/validation/snippet.schema'

export function SnippetDetail({ snippet }: { snippet: Snippet }) {
  const [isEditing, setIsEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const navigate = useNavigate()

  const updateMutation = useUpdateSnippetMutation()
  const deleteMutation = useDeleteSnippetMutation()
  const toggleFavoriteMutation = useToggleFavoriteMutation()

  const languageLabel = SNIPPET_LANGUAGES.find((l) => l.value === snippet.language)?.label ?? snippet.language

  const handleUpdate = (values: SnippetFormValues) => {
    updateMutation.mutate(
      { id: snippet.id, payload: values },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(snippet.id, {
      onSuccess: () => navigate({ to: '/snippets' }),
    })
  }

  if (isEditing) {
    return (
      <div className="mx-auto w-full max-w-3xl p-6">
        <h2 className="mb-4 text-base font-semibold">Edit snippet</h2>
        <SnippetForm
          defaultValues={{
            title: snippet.title,
            description: snippet.description,
            language: snippet.language,
            code: snippet.code,
            tags: snippet.tags,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save changes"
          isPending={updateMutation.isPending}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">{snippet.title}</h2>
          {snippet.description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{snippet.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => toggleFavoriteMutation.mutate(snippet.id)}
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle favorite"
          >
            <Star size={16} className={snippet.favorite ? 'fill-amber-400 text-amber-400' : ''} />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Edit snippet"
          >
            <Pencil size={16} />
          </button>
          {confirmingDelete ? (
            <div className="flex items-center gap-1.5 rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-1">
              <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded px-2 py-0.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded px-2 py-0.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-md p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              aria-label="Delete snippet"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400">
          {languageLabel}
        </span>
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet-100 dark:bg-violet-500/15 px-2 py-0.5 text-xs text-violet-700 dark:text-violet-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <CodeBlock code={snippet.code} language={highlighterLanguageFor(snippet.language)} />
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Updated {new Date(snippet.updatedAt).toLocaleString()}
      </p>
    </div>
  )
}
