import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage,} from "@/components/ui/form.tsx";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {z} from "zod";
import {
	useForm,
	type UseFormReturn
} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {NumberInput} from "@/components/number-form-input.tsx";
import {SelectTrigger, SelectItem, SelectContent, SelectValue, Select} from "@/components/ui/select.tsx";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {toast} from "sonner";
import {useNavigate, type UseNavigateResult} from "@tanstack/react-router";


const formSchema = z.object({
	sex: z.enum(["male", "female"]),
	age: z.number(),
	weight: z.number(),
	height: z.number(),
})

type FormSchema = z.infer<typeof formSchema>;

async function deleteAccount(navigate: UseNavigateResult<string>) {
	try {
		const response = await fetch(import.meta.env.VITE_API_URL + "delete-account",
			{
				credentials: "include",
				mode: "cors",
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
					"Content-Type": "application/json; charset=utf-8",
				},
			})

		if (response.ok) {
			await navigate({to: "/"});
		} else {
			toast.error("Failed to delete account");
		}
	} catch (e) {
		toast.error("Failed to delete account", {description: "Could not connect to the server"});
	}

}

export function DeleteButton() {
	const navigate = useNavigate();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" type="button" className="flex flex-1">Delete</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. It will permanently destroy all your data and you will not be able to recover
						it.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					{/*todo turn on*/}
					{/*onClick={() => deleteAccount(navigate)}*/}
					<AlertDialogAction
						className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
					>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function ProfileAttribute({description, fieldName, form}: {
	description: string,
	fieldName: keyof FormSchema,
	form: UseFormReturn<FormSchema>,
}) {
	return (
		<FormField
			control={form.control}
			name={fieldName}
			render={({field}) => (
				<FormItem className="flex flex-row gap-6">
					<FormLabel className="w-1/10">{description}</FormLabel>
					<FormControl className="w-9/10">
						<NumberInput field={field} placeholder={description}/>
					</FormControl>
					<FormMessage/>
				</FormItem>
			)}
		/>
	)
}

export function ProfileCard() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sex: "male",
			age: 18,
			weight: 70,
			height: 170,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
	}

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex flex-row">
						<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
							Username
						</h3>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
							<FormField
								control={form.control}
								name={"sex"}
								render={({field}) => (
									<FormItem className="flex flex-row gap-6">
										<FormLabel className="w-1/10">Sex</FormLabel>
										<Select
											onValueChange={(value: FormSchema["sex"]) => {
												field.onChange(value);
											}}
											value={field.value}>
											<FormControl className="w-9/10">
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select the type of target"/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<ProfileAttribute description={"Age"} fieldName={"age"} form={form}/>
							<ProfileAttribute description={"Weight"} fieldName={"weight"} form={form}/>
							<ProfileAttribute description={"Height"} fieldName={"height"} form={form}/>
							<div className="flex w-full flex-row gap-6">
								<FormControl>
									<Button variant="outline" className="flex flex-1">
										Save changes
									</Button>
								</FormControl>
								<FormControl>
									<DeleteButton/>
								</FormControl>
							</div>
						</form>
					</Form>
				</CardContent>
				<CardFooter>
				</CardFooter>
			</Card>
		</div>

	)
}