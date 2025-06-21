import {createFileRoute, notFound} from '@tanstack/react-router'
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {type BoolHabit, type MeasureHabit, useHabits, type WaterHabit} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {CaloriesCard} from "@/components/cards/calories-card.tsx";
import CompleteMealCard from "@/components/cards/meals-card.tsx";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {useEffect} from "react";

export const Route = createFileRoute('/_authenticated/meals/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const {id} = Route.useParams();
	// const {isLoading, habits} = useHabits();
	//
	// if (isLoading) {
	// 	return (
	// 		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
	// 			<Skeleton className="flex flex-1"/>
	// 			<Skeleton className="flex flex-1"/>
	// 			<Skeleton className="flex flex-1"/>
	// 			<Skeleton className="flex flex-1"/>
	// 		</div>
	// 	)
	// }
	//
	// let list: (BoolHabit | MeasureHabit | WaterHabit)[] = habits.bool
	// list = list.concat(habits.measure).concat(habits.water);
	// const data = list.find((h) => h.id === Number(id))
	//
	// if (data === undefined) {
	// 	throw notFound()
	// }


	const {setBreadcrumbs} = useBreadcrumbs()

	useEffect(() => {
		setBreadcrumbs(["Dashboard"])
	}, []);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<LineplotCard/>
			</div>
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<CompleteMealCard/>
			</div>
			<div className="bg-muted/50 flex rounded-xl">
				<CalendarCard/>
			</div>
			<div className="bg-muted/50 flex flex-1 rounded-xl">
				<CaloriesCard/>
			</div>
		{/*	todo notes card*/}
		</div>
	)
}
