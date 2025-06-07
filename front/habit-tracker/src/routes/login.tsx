import {createFileRoute} from '@tanstack/react-router'
import {LoginForm} from "@/components/login-form.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {RegisterForm} from "@/components/register-form.tsx";

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Tabs defaultValue="login" className="w-[400px]">
					<TabsList>
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<LoginForm/>
					</TabsContent>
					<TabsContent value="register">
						<RegisterForm/>
					</TabsContent>
				</Tabs>
			</div>
		</div>

	)
}
