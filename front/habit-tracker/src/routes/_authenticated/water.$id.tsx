import {createFileRoute, notFound} from '@tanstack/react-router'
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {NotesCard} from "@/components/cards/notes-card.tsx";
import {useHabits, type WaterHabit} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import CompletionWaterCard from "@/components/cards/completion-water-card.tsx";

export const Route = createFileRoute('/_authenticated/water/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const {id} = Route.useParams();
	const {isLoading, habits} = useHabits();
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
				<Skeleton className="flex flex-1"/>
				<Skeleton className="flex flex-1"/>
				<Skeleton className="flex flex-1"/>
				<Skeleton className="flex flex-1"/>
			</div>
		)
	}
	let list:  WaterHabit[] = habits.water
	const data = list.find((h) => h.id === Number(id))

	if (data === undefined) {
		throw notFound()
	}



	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<LineplotCard data={data}/>
			</div>
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<CompletionWaterCard data={data}/>
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
