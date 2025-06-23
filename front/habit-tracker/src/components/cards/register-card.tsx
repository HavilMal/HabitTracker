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
import {useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {toast} from "sonner";

const formSchema = z.object({
	username: z.string().regex(/^\S*$/g, "Username cannot include whitespace")
	// .min(2, {message: "Username must be at least 2 characters.", })
	,
	password: z.string()
	// .min(8, {message: "Password must be at least 8 characters.", })
	,
	confirmPassword: z.string()
}).superRefine((data, ctx) => {
	if (data.password !== data.confirmPassword) {
		ctx.addIssue({
			code: "custom",
			message: "Passwords don't match",
			path: ["confirmPassword"],
		})
	}
})

export function RegisterCard() {
	const auth = useAuth();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await auth.register(values.username, values.password)
			if (response) {
				await navigate({to: "/dashboard"})
			} else {
				form.reset();
				toast.error("Failed to register", {description: "User with this username may already exist"})
			}
		} catch (e) {
			form.reset();
			toast.error("Failed to register", {description: "Could not connect to the server"})
		}

	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create your account</CardTitle>
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
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({field}) => (
								<FormItem>
									<FormLabel>Confirm password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="confirm password" {...field} />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormItem>
							<FormControl>
								<Button type="submit">Register</Button>
							</FormControl>
						</FormItem>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}