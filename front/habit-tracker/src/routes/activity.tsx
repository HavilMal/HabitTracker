import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/activity')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-row gap-4 p-4 max-w-full h-full">
      <div className="flex flex-col gap-4 w-1/2 min-w-0">
        <div className="bg-muted/50 flex flex-1 rounded-xl" />
        <div className="bg-muted/50 flex flex-1 rounded-xl" />
      </div>
      <div className="bg-muted/50 flex flex-1 rounded-xl min-w-0" />
    </div>
	)
}
