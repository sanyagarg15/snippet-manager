import { z } from 'zod'
import { SNIPPET_LANGUAGES, type SnippetLanguage } from '@/types/snippet.types'

const languageValues = SNIPPET_LANGUAGES.map((l) => l.value) as [SnippetLanguage, ...SnippetLanguage[]]

export const snippetFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional(),
  language: z.enum(languageValues),
  code: z.string().min(1, 'Code cannot be empty'),
  tags: z.array(z.string().trim().min(1)).max(20, 'Too many tags'),
})

export type SnippetFormValues = z.infer<typeof snippetFormSchema>

export const snippetSearchSchema = z.object({
  q: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
})

export type SnippetSearchParams = z.infer<typeof snippetSearchSchema>
