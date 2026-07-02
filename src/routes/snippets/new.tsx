import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SnippetForm } from '@/components/snippets/SnippetForm'
import { useCreateSnippetMutation } from '@/lib/query/snippets.queries'
import type { SnippetFormValues } from '@/lib/validation/snippet.schema'

export const Route = createFileRoute('/snippets/new')({
  component: NewSnippetPage,
})

function NewSnippetPage() {
  const navigate = useNavigate()
  const createMutation = useCreateSnippetMutation()

  const handleSubmit = (values: SnippetFormValues) => {
    createMutation.mutate(values, {
      onSuccess: (snippet) => navigate({ to: '/snippets/$id', params: { id: snippet.id } }),
    })
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h2 className="mb-4 text-base font-semibold">New snippet</h2>
      <SnippetForm
        onSubmit={handleSubmit}
        submitLabel="Create snippet"
        isPending={createMutation.isPending}
        onCancel={() => navigate({ to: '/snippets' })}
      />
    </div>
  )
}
