import { createFileRoute } from '@tanstack/react-router'
import { FileCode } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

export const Route = createFileRoute('/snippets/')({
  component: () => (
    <EmptyState
      icon={<FileCode size={32} />}
      title="Select a snippet"
      description="Choose a snippet from the list, or create a new one."
    />
  ),
})
