import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { snippetFormSchema, type SnippetFormValues } from '@/lib/validation/snippet.schema'
import { SNIPPET_LANGUAGES } from '@/types/snippet.types'
import { TagInput } from '@/components/common/TagInput'

interface SnippetFormProps {
  defaultValues?: Partial<SnippetFormValues>
  onSubmit: (values: SnippetFormValues) => void
  onCancel?: () => void
  submitLabel: string
  isPending?: boolean
}

const inputClass =
  'w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500'
const labelClass = 'mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400'
const errorClass = 'mt-1 text-xs text-red-500'

export function SnippetForm({ defaultValues, onSubmit, onCancel, submitLabel, isPending }: SnippetFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      language: defaultValues?.language ?? 'typescript',
      code: defaultValues?.code ?? '',
      tags: defaultValues?.tags ?? [],
    },
  })

  const tags = watch('tags')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input id="title" className={inputClass} placeholder="e.g. Debounce hook" {...register('title')} />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="language">
            Language
          </label>
          <select id="language" className={inputClass} {...register('language')}>
            {SNIPPET_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tags</label>
          <TagInput tags={tags} onChange={(next) => setValue('tags', next, { shouldValidate: true })} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="description"
          className={inputClass}
          placeholder="What does this snippet do?"
          {...register('description')}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="code">
          Code
        </label>
        <textarea
          id="code"
          rows={14}
          spellCheck={false}
          className={`${inputClass} font-mono text-[13px] leading-relaxed`}
          placeholder="Paste your snippet…"
          {...register('code')}
        />
        {errors.code && <p className={errorClass}>{errors.code.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
