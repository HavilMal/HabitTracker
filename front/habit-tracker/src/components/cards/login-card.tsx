import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from "@/components/ui/form.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Input} from "@/components/ui/input.tsx";
import {useAuth} from "@/hooks/auth.tsx";
import {useNavigate} from "@tanstack/react-router";
import {useState} from "react";

const formSchema = z.object({
	username: z.string().regex(/^\S*$/g, "Username cannot include whitespace")
	// .min(2, {message: "Username must be at least 2 characters.", })
	,
	password: z.string()
	// .min(8, {message: "Password must be at least 8 characters.", })
	,
})

export function LoginCard() {
	const auth = useAuth()
	const navigate = useNavigate()
	const [error, setError] = useState(false);


	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await auth.login(values.username, values.password)
		if (response) {
			await navigate({to: "/dashboard"})
		} else {
			form.reset();
			setError(true);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="username"
								render={({field}) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="username" {...field} />
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({field}) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" placeholder="password" {...field} />
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<FormItem>
								<FormControl>
									<Button type="submit">Login</Button>
								</FormControl>
							</FormItem>
						</form>
					</Form>

				</CardContent>
			</Card>
			<div className="relative">
				{error && (
					<Alert variant="destructive" className="absolute">
						<AlertTitle>Login Failed</AlertTitle>
						<AlertDescription>Incorrect login or password</AlertDescription>
					</Alert>
				)}
			</div>
		</div>
	)
}