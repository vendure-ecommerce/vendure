import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_customer-groups/customer-groups_/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/_customer-groups/customer-groups_/$id"!</div>
  )
}
