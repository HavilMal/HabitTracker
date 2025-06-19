import {createFileRoute} from '@tanstack/react-router'
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import CompletionCard from "@/components/cards/completed-card.tsx";
import {NotesCard} from "@/components/cards/notes-card.tsx";

export const Route = createFileRoute('/_authenticated/habit/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<LineplotCard/>
			</div>
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<CompletionCard/>
			</div>
			<div className="bg-muted/50 flex rounded-xl">
				<CalendarCard/>
			</div>
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<NotesCard/>
			</div>
		</div>
	)
}
