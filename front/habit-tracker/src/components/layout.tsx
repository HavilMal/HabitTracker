import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import * as React from "react";
import {useNavigate, useRouter} from "@tanstack/react-router";
import {Button} from "@/components/ui/button.tsx";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {AppSidebar} from "@/components/sidebar-list.tsx";
import {useAuth} from "@/hooks/auth.tsx";


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
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-2"/>
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Button variant="outline" onClick={handleLogout}>Logout</Button>
					<ModeToggle className="ml-auto"/>
				</header>
				{children}
			</main>
		</SidebarProvider>
	)
}
