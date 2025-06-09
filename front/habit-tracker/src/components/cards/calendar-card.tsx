import {
	Card,
	CardContent,
} from "@/components/ui/card.tsx"
import {Calendar} from "@/components/ui/calendar.tsx"

const data = [
	new Date(2025, 5, 8),
	new Date(2025, 5, 9),
	new Date(2025, 5, 16),
	new Date(2025, 5, 19),
]

function Month({date, data}: {date: Date, data: Date[]}) {
	const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

	const active_days = data.filter(d => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth());

	var days = []
	for (let i = 0; i < daysInMonth(date.getFullYear(), date.getMonth() + 1); i++) {
		days.push(
			<div className="flex flex-1 bg-green-700 rounded-lg" key={i}></div>
		)
	}

	return (
		<div className="flex flex-1">
			<div className="grid grid-cols-7 gap-4 w-full h-full p-4">
				{days}
			</div>
		</div>
	)
}

// todo check
export default function CalendarCard() {
	return (
		<Card className="flex flex-1">
			<CardContent className="flex flex-1">
				{/*<Calendar className="flex w-full h-full"*/}
				{/*          classNames={{*/}
				{/*	          months:*/}
				{/*		          "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",*/}
				{/*	          month: "space-y-4 w-full flex flex-col",*/}
				{/*	          table: "w-full h-full border-collapse space-y-1",*/}
				{/*	          head_row: "",*/}
				{/*	          row: "w-full mt-2",*/}
				{/*          }}*/}
				{/*          selected={data}*/}
				{/*/>*/}
				<Month date={new Date()} data={data}/>
			</CardContent>
		</Card>
	)
}