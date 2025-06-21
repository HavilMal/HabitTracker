import {createFileRoute} from '@tanstack/react-router'
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {NotesCard} from "@/components/cards/notes-card.tsx";
import {CompleteActivityCard} from "@/components/cards/completed-activity-card.tsx";

export const Route = createFileRoute('/_authenticated/activity/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
			<LineplotCard/>
			<CompleteActivityCard/>
			<CalendarCard/>
			<NotesCard/>
		</div>
	)
}
