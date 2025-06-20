import {createFileRoute} from '@tanstack/react-router'
import {useEffect} from "react";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {StreakChart} from "@/components/cards/streak-card.tsx";
import {TodoCard} from "@/components/cards/todo-card.tsx";
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import {CaloriesChart} from "@/components/cards/calories-card.tsx";

export const Route = createFileRoute('/_authenticated/dashboard')({
	component: RouteComponent,
})

function RouteComponent() {
	const {setBreadcrumbs} = useBreadcrumbs()

	useEffect(() => {
		setBreadcrumbs(["Dashboard"])
	}, []);

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
					<CaloriesChart/>
				</div>
			</div>
			<LineplotCard className="min-h-1/4" title="Total completion" description="Percentage of all habits completed" />
		</div>
	)
}
