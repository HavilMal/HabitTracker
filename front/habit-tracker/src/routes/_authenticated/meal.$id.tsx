import {createFileRoute, notFound} from '@tanstack/react-router'
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {CaloriesCard} from "@/components/cards/calories-card.tsx";
import {CompletionMealCard} from "@/components/cards/completion-meal-card.tsx";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {useEffect} from "react";
import {useHabits} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchHabitStats, type Stats, type History} from "@/lib/utils.ts";
import {NotesCard} from "@/components/cards/notes-card.tsx";


export const Route = createFileRoute('/_authenticated/meal/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const {id} = Route.useParams();
	const {isLoading, habits} = useHabits();
	const {setBreadcrumbs} = useBreadcrumbs()

	const data = habits?.meal.find((h) => h.id === Number(id))

	useEffect(() => {
		if (data === undefined) {
			setBreadcrumbs(["Meal"])
		} else {
			setBreadcrumbs(["Meal", data.name])
		}
	}, [data]);

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

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-h-full h-full">
			<LineplotCard chartData={chartData} accessKey="stats" className="flex h-full" title="Habit completion"
			              description="Percentage of habits completed up to given date"/>
			<CompletionMealCard data={data}/>
			<CalendarCard history={history} className="flex h-full"/>
			<NotesCard data={data}/>
		</div>
	)
}
