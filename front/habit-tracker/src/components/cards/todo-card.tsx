import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"


const data = [
	// {
	// 	name: "Habit",
	// 	status: "Not completed",
	// },
	// {
	// 	name: "Measure",
	// 	status: "Missing"
	// }
]

export function TodoCard() {
	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="items-center pb-0">
				<CardTitle>Habits for today</CardTitle>
				<CardDescription>List of habits that you need to do today</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col ">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-1/2 font-bold">Name</TableHead>
							<TableHead className="font-bold">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((item, index) => (
							<TableRow key={index}>
								<TableCell className="font-medium">{item.name}</TableCell>
								<TableCell>{item.status}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{data.length > 0 ? <></> :
					<div className="flex p-6 justify-center">
						<p>All done!</p>
					</div>
				}
			</CardContent>
		</Card>
	)
}
