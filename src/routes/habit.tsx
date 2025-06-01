import {createFileRoute} from '@tanstack/react-router'
import {ChartLineDefault} from "@/components/lineplot.tsx";

export const Route = createFileRoute('/habit')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-row gap-4 p-4 max-w-full h-full">
			<div className="flex flex-col gap-4 w-1/2 min-w-0">
				<div className="bg-muted/50 flex flex-1 rounded-xl h-1/2">
					<ChartLineDefault/>
				</div>
				<div className="bg-muted/50 flex flex-1 rounded-xl h-1/2"/>
			</div>
			<div className="flex flex-col gap-4 w-1/2 min-w-0">
				<div className="bg-muted/50 flex flex-1 rounded-xl"/>
			</div>
		</div>
	)
}
