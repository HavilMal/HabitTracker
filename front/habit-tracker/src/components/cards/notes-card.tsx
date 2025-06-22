import {Form, FormField, FormItem, FormMessage,} from "@/components/ui/form.tsx";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {z} from "zod";
import {
	useForm,
} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {type Habit, useHabits} from "@/hooks/habit-provider.tsx";

const formSchema = z.object({
	notes: z.string(),
})

export function NotesCard({data}: {data: Habit}) {
	const {refreshHabits} = useHabits();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			notes: data?.notes || "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch(import.meta.env.VITE_API_URL + "habit/notes",
			{
				credentials: "include",
				mode: "cors",
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
					"Content-Type": "application/json; charset=utf-8",
				},
				body: JSON.stringify({...values, type: data.type, habit_id: data.id}),
			})

		if (response.ok) {
			refreshHabits();
		} else {
			form.reset();
			// todo
			// setError(true)
		}
	}


	return (
		<div className="flex flex-col w-full h-full gap-6">
			<Form {...form} >
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 space-y-8">
					<Card className="w-full h-full">
						<CardHeader>
							<CardTitle className="flex flex-row">
								Notes
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col h-full">
							<FormField
								control={form.control}
								name="notes"
								render={({field}) => (
									<FormItem className="flex flex-row gap-6 w-full h-full">
										<Textarea {...field} placeholder="Add some notes!" className="resize-none"/>
										<FormMessage/>
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className="flex gap-6">
							<Button type="submit" className="flex flex-1" onClick={form.handleSubmit(onSubmit)}>
								Submit
							</Button>
							<Button type="submit" variant="destructive" className="flex flex-1" onClick={form.handleSubmit(onSubmit)}>
								Delete
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>

	)
}
