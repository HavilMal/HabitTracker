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
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Input} from "@/components/ui/input.tsx";
import {useAuth} from "@/hooks/auth.tsx";
import {useNavigate} from "@tanstack/react-router";

const formSchema = z.object({
	username: z.string()
	// .min(2, {message: "Username must be at least 2 characters.", })
	,
	password: z.string()
	// .min(8, {message: "Password must be at least 8 characters.", })
	,
})

export function LoginForm() {
	const auth = useAuth()
	const navigate = useNavigate()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await auth.login(values.username)
		await navigate({to: "/dashboard"})
	}

	return (
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
	)
}