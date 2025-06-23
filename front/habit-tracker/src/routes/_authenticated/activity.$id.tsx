import {createFileRoute, notFound} from '@tanstack/react-router'
import {
  type ActivityHabit,
  useHabits,
} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {LineplotCard} from "@/components/cards/lineplot-card.tsx";
import CalendarCard from "@/components/cards/calendar-card.tsx";
import {NotesCard} from "@/components/cards/notes-card.tsx";
import {CompletionActivityCard} from "@/components/cards/completion-activity-card.tsx";

export const Route = createFileRoute('/_authenticated/activity/$id')({
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

  let list: ActivityHabit[] = habits.activity
  const data = list.find((h) => h.id === Number(id))

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
