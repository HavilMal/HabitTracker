import {createFileRoute} from '@tanstack/react-router'
import {LineplotCard} from "@/components/lineplot.tsx";
import CalendarCard from "@/components/calendar.tsx";
import ItemListCard from "@/components/item-list.tsx";

export const Route = createFileRoute('/habit')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col lg:flex-row gap-4 p-4 max-w-full h-full">
			<div className="flex flex-col gap-4 lg:w-1/2 min-w-0">
				<div className="bg-muted/50 flex flex-1 rounded-xl">
					<LineplotCard/>
				</div>
				<div className="bg-muted/50 flex flex-1 rounded-xl h-1/2">
					<CalendarCard/>
				</div>
			</div>
			<div className="flex flex-col gap-4 lg:w-1/2 min-w-0">
				<div className="bg-muted/50 flex flex-1 rounded-xl">
					<ItemListCard/>
				</div>
			</div>
		</div>
	)
}
