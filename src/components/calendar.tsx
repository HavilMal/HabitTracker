import {
	Card,
	CardContent,
} from "@/components/ui/card.tsx"
import {Calendar} from "@/components/ui/calendar.tsx"

// todo check
export default function CalendarCard() {
	return (
		<Card className="flex flex-1">
			<CardContent className="flex flex-1">
				<Calendar className="flex w-full h-full" classNames={{
					months:
						"flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
					month: "space-y-4 w-full flex flex-col",
					table: "w-full h-full border-collapse space-y-1",
					head_row: "",
					row: "w-full mt-2",
				}}/>
			</CardContent>
		</Card>
	)
}