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
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton.tsx";


type ToDo = {
	habit_id: number;
	name: string;
}

type ToDoData = {
	habits_todo: ToDo[];
}


export function TodoCard() {
	async function fetchTodo(): Promise<ToDoData> {
		const res = await fetch(import.meta.env.VITE_API_URL + "get-habits-todo", {
			credentials: "include",
			mode: "cors",
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
				"Content-Type": "application/json; charset=utf-8",
			},
		});
		if (!res.ok) {
			throw new Error('Failed to fetch habits');
		}

		return res.json();
	}

	const {data, isLoading} = useQuery({
		queryKey: ['todo'],
		queryFn: fetchTodo,
		// staleTime: 1000 * 60 * 5,
	});


	let message = "All done!"

	if (isLoading) {
		message = "Loading..."
	} else if (data === undefined) {
		message = "Failed to load"
	}

	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="items-center pb-0">
				<CardTitle>Habits for today</CardTitle>
				<CardDescription>List of habits that you need to do today</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col ">
				{data === undefined || data.habits_todo.length === 0 ?
					<div className="flex flex-1 p-6 justify-center items-center">
						<p className="text-muted-foreground text-sm text-center">{message}</p>
					</div>
					:
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-1/2 font-bold">Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.habits_todo.map((item, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">{item.name}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				}
			</CardContent>
		</Card>
	)
}
