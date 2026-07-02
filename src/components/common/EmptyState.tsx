import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      {icon && <div className="text-zinc-300 dark:text-zinc-700">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
        {description && <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}
