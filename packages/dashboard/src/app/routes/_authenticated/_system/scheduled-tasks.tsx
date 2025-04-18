import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_system/scheduled-tasks')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/_system/scheduled-tasks"!</div>
}
