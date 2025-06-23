import {createFileRoute, notFound} from '@tanstack/react-router'
import {
  useHabits,
} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {NotesCard} from "@/components/cards/notes-card.tsx";
import {CompletionActivityCard} from "@/components/cards/completion-activity-card.tsx";
import {useEffect} from "react";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";

export const Route = createFileRoute('/_authenticated/activity/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const {id} = Route.useParams();
  const {isLoading, habits} = useHabits();
  const {setBreadcrumbs} = useBreadcrumbs()

  const data = habits?.activity.find((h) => h.id === Number(id))

	useEffect(() => {
		if (data === undefined) {
			setBreadcrumbs(["Activity"])
		} else {
			setBreadcrumbs(["Activity", data.name])
		}
	}, [data]);

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

  const selected = data.measurements.map((value) => value.activity_datetime)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[1fr_1fr] gap-4 p-4 max-w-full h-full">
      <LineplotCard data={data}/>
      <CompletionActivityCard data={data}/>
      <CalendarCard selected={selected}/>
      <NotesCard data={data}/>
    </div>
  )
}
