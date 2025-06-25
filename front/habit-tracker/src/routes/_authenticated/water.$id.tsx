import {createFileRoute, notFound} from '@tanstack/react-router'
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {NotesCard} from "@/components/cards/notes-card.tsx";
import {useHabits} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import CompletionWaterCard from "@/components/cards/completion-water-card.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchHabitStats, type Stats, type History} from "@/lib/utils.ts";

export const Route = createFileRoute('/_authenticated/water/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const {id} = Route.useParams();
	const {isLoading, habits} = useHabits();

	const data = habits?.water.find((h) => h.id === Number(id))

	const {data: chartData} = useQuery({
		queryKey: ["stats", Number(id)],
		queryFn: () => fetchHabitStats<Stats>({id: Number(id)}),
		staleTime: 1000 * 60 * 5,
	});

	const {data: history} = useQuery({
		queryKey: ["history", Number(id)],
		queryFn: () => fetchHabitStats<History>({endpoint: "get-habit-history", id: Number(id)}),
		staleTime: 1000 * 60 * 5,
	});

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

	if (data === undefined) {
		throw notFound()
	}

	if (chartData) {
		chartData["stats"] = chartData["stats"].map(value => ({date: value.date, percentage: value.percentage > 1 ? value.percentage : value.percentage * 100}));
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
			<LineplotCard chartData={chartData} accessKey="stats" title="Habit completion" domainMax={110}
			              description="Percentage of habits completed up to given date"/>
			<CompletionWaterCard data={data}/>
			<CalendarCard history={history}/>
			<NotesCard key={data.id} data={data}/>
		</div>
	)
}
