import {createFileRoute} from '@tanstack/react-router'
import {useEffect} from "react";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {StreakChart} from "@/components/cards/streak-card.tsx";
import {TodoCard} from "@/components/cards/todo-card.tsx";
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import {CaloriesCard} from "@/components/cards/calories-card.tsx";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {fetchHabitStats} from "@/lib/utils.ts";

export const Route = createFileRoute('/_authenticated/dashboard')({
	component: RouteComponent,
})


function RouteComponent() {
	const {setBreadcrumbs} = useBreadcrumbs()

	useEffect(() => {
		setBreadcrumbs(["Dashboard"])
	}, []);

	const {data, isLoading} = useQuery({
		queryKey: ['summary'],
		queryFn: () => fetchHabitStats({endpoint: "get-habits-summary"}),
		staleTime: 1000 * 60 * 5,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="grid auto-rows-min gap-4 xl:grid-cols-3">
				<div className="bg-muted/50 rounded-xl">
					<StreakChart/>
				</div>
				<div className="bg-muted/50 rounded-xl ">
					<TodoCard/>
				</div>
				<div className="bg-muted/50 rounded-xl ">
					<CaloriesCard/>
				</div>
			</div>
			{isLoading ?
				<Skeleton className="flex flex-1 min-h-1/4"/>
				:
				<LineplotCard chartData={data} accessKey="summary" className="min-h-1/4" title="Total completion"
				              description="Percentage of all habits completed"/>
			}
		</div>
	)
}
