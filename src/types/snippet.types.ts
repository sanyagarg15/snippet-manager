export type SnippetId = string & { readonly __brand: 'SnippetId' }

export const SNIPPET_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript', highlighter: 'typescript' },
  { value: 'javascript', label: 'JavaScript', highlighter: 'javascript' },
  { value: 'tsx', label: 'TSX (React)', highlighter: 'tsx' },
  { value: 'jsx', label: 'JSX (React)', highlighter: 'jsx' },
  { value: 'python', label: 'Python', highlighter: 'python' },
  { value: 'css', label: 'CSS', highlighter: 'css' },
  { value: 'html', label: 'HTML', highlighter: 'markup' },
  { value: 'sql', label: 'SQL', highlighter: 'sql' },
  { value: 'bash', label: 'Bash', highlighter: 'bash' },
  { value: 'json', label: 'JSON', highlighter: 'json' },
  { value: 'yaml', label: 'YAML', highlighter: 'yaml' },
  { value: 'go', label: 'Go', highlighter: 'go' },
  { value: 'rust', label: 'Rust', highlighter: 'rust' },
  { value: 'other', label: 'Other', highlighter: 'text' },
] as const

export type SnippetLanguage = (typeof SNIPPET_LANGUAGES)[number]['value']

export function highlighterLanguageFor(language: string): string {
  return SNIPPET_LANGUAGES.find((l) => l.value === language)?.highlighter ?? 'text'
}

export interface Snippet {
  id: SnippetId
  title: string
  description?: string
  language: SnippetLanguage
  code: string
  tags: string[]
  favorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSnippetPayload {
  title: string
  description?: string
  language: SnippetLanguage
  code: string
  tags: string[]
}

export type UpdateSnippetPayload = Partial<CreateSnippetPayload>
