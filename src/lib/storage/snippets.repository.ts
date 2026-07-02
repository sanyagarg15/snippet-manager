import { nanoid } from 'nanoid'
import type { CreateSnippetPayload, Snippet, SnippetId, UpdateSnippetPayload } from '@/types/snippet.types'

const STORAGE_KEY = 'snippet-manager:snippets:v1'

function readAll(): Snippet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(snippets: Snippet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}

async function list(): Promise<Snippet[]> {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

async function get(id: SnippetId): Promise<Snippet | undefined> {
  return readAll().find((s) => s.id === id)
}

async function create(payload: CreateSnippetPayload): Promise<Snippet> {
  const now = new Date().toISOString()
  const snippet: Snippet = {
    id: nanoid() as SnippetId,
    title: payload.title,
    description: payload.description,
    language: payload.language,
    code: payload.code,
    tags: payload.tags,
    favorite: false,
    createdAt: now,
    updatedAt: now,
  }
  const snippets = readAll()
  snippets.push(snippet)
  writeAll(snippets)
  return snippet
}

async function update(id: SnippetId, payload: UpdateSnippetPayload): Promise<Snippet> {
  const snippets = readAll()
  const index = snippets.findIndex((s) => s.id === id)
  if (index === -1) throw new Error(`Snippet ${id} not found`)
  const updated: Snippet = {
    ...snippets[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  snippets[index] = updated
  writeAll(snippets)
  return updated
}

async function remove(id: SnippetId): Promise<void> {
  writeAll(readAll().filter((s) => s.id !== id))
}

async function toggleFavorite(id: SnippetId): Promise<Snippet> {
  const snippets = readAll()
  const index = snippets.findIndex((s) => s.id === id)
  if (index === -1) throw new Error(`Snippet ${id} not found`)
  const updated: Snippet = {
    ...snippets[index],
    favorite: !snippets[index].favorite,
    updatedAt: new Date().toISOString(),
  }
  snippets[index] = updated
  writeAll(snippets)
  return updated
}

export const snippetsRepository = {
  list,
  get,
  create,
  update,
  remove,
  toggleFavorite,
}
