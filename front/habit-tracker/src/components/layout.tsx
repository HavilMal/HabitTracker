import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import * as React from "react";
import {AppSidebar} from "@/components/sidebar-list.tsx";

import {Navbar} from "@/components/navbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export default function Layout({
	                               children
                               }: {
	children: React.ReactNode
}) {
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
				</Navbar>
				{children}
			</main>
		</SidebarProvider>
	)
}
