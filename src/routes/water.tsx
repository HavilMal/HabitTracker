import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/water')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/water"!</div>
}
