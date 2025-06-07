import {createFileRoute} from '@tanstack/react-router'
import {LoginForm} from "@/components/login-form.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {RegisterForm} from "@/components/register-form.tsx";
import {Navbar} from "@/components/navbar.tsx";

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<main className="flex flex-col min-h-svh">
			<Navbar/>
			<div className="flex flex-col flex-1 items-center justify-center ">
				<div className="w-full max-w-sm">
					<Tabs defaultValue="login">
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
		</main>
	)
}
