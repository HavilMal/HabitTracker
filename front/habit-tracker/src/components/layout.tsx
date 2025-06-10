import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import * as React from "react";
import {useNavigate, useRouter} from "@tanstack/react-router";
import {AppSidebar} from "@/components/sidebar-list.tsx";
import {useAuth} from "@/hooks/auth.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Navbar} from "@/components/navbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export default function Layout({
	                               children
                               }: {
	children: React.ReactNode
}) {
	const auth = useAuth()
	const router = useRouter()
	const navigate = useNavigate()


	async function handleLogout() {
		try {
			await auth.logout()
			await router.invalidate();
		} finally {
			await navigate({to: "/login"});
		}
	}

	return (
		<SidebarProvider>
			<AppSidebar/>
			<main className="flex flex-col shrink-0 flex-1">
				<Navbar>
					<SidebarTrigger className="-ml-2"/>
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Button variant="outline" onClick={handleLogout}>Logout</Button>
				</Navbar>
				{children}
			</main>
		</SidebarProvider>
	)
}
