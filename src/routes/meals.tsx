import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/meals')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/meals"!</div>
}
