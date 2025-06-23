import {createFileRoute, notFound} from '@tanstack/react-router'
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {NotesCard} from "@/components/cards/notes-card.tsx";
import {type BoolHabit, type MeasureHabit, useHabits} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import CompletionBoolCard from "@/components/cards/completion-bool-card.tsx";
import CompletionMeasureCard from "@/components/cards/completion-measure-card.tsx";

export const Route = createFileRoute('/_authenticated/habit/$id')({
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

	if (habits === undefined) {
		throw notFound()
	}

	let list: (BoolHabit | MeasureHabit)[] = habits.bool
	list = list.concat(habits.measure);
	let data = list.find((h) => h.id === Number(id))

	if (data === undefined) {
		throw notFound()
	}

	let selected: string[] = [];
	if (data.type === "bool") {
		selected = data.completed_days;
	} else {
		selected = data.measurements.map((value) => value.date)
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
				<LineplotCard data={data} />
				{data.type === "bool" ? <CompletionBoolCard data={data as BoolHabit} /> : <CompletionMeasureCard data={data as MeasureHabit} />}
				<CalendarCard selected={selected}/>
				<NotesCard key={data.id} data={data}/>
		</div>
	)
}
