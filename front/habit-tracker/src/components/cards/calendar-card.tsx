import {
	Card,
	CardContent,
} from "@/components/ui/card.tsx"
import {Calendar} from "@/components/ui/calendar.tsx"
import {cn, type History} from "@/lib/utils.ts";

export default function CalendarCard({history, className}: {history?: History, className?: string}) {
	const data = history?.history.filter(val => val[1] === 1).map(val => new Date(val[0]))

	return (
		<Card className={cn("flex flex-1", className)}>
			<CardContent className="flex flex-1">
				<Calendar className="flex w-full h-full"
				          classNames={{
					          months:
						          "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
					          month: "space-y-4 w-full flex flex-col",
					          month_grid: "w-full h-full border-collapse space-y-1",
					          weekdays: "",
					          week: "w-full mt-2",
					          selected: "bg-chart-2 text-primary-foreground hover:bg-chart-2 dark:hover:brightness-110 focus:bg-primary/90 dark:focus:brightness-110",
				          }}
				          mode="multiple"
				          selected={data}
				/>
			</CardContent>
		</Card>
	)
}