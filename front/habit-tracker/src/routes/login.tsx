import {createFileRoute} from '@tanstack/react-router'
import {LoginCard} from "@/components/cards/login-card.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {RegisterCard} from "@/components/cards/register-card.tsx";
import {Navbar} from "@/components/navbar.tsx";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {useEffect} from "react";

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

function RouteComponent() {
	const {setBreadcrumbs} = useBreadcrumbs()

	useEffect(() => {
		setBreadcrumbs(["Login"])
	}, []);

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
							<LoginCard/>
						</TabsContent>
						<TabsContent value="register">
							<RegisterCard/>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</main>
	)
}
