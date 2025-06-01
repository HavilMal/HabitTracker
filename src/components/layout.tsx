import {
	Sidebar, SidebarContent, SidebarGroup, SidebarProvider,
	SidebarTrigger, SidebarGroupLabel, SidebarGroupContent, SidebarMenu,
	SidebarMenuItem, SidebarMenuButton
} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Calendar, Home, Inbox, Search, Settings} from "lucide-react"
import * as React from "react";
import {Link} from "@tanstack/react-router";

const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Habit",
		url: "/habit",
		icon: Inbox,
	},
	{
		title: "Activity",
		url: "/activity",
		icon: Calendar,
	},
	{
		title: "Meals",
		url: "/meals",
		icon: Search,
	},
	{
		title: "Water",
		url: "/water",
		icon: Settings,
	},
]

export function AppSidebar() {
	return (
		<Sidebar variant="sidebar">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link to={item.url}>
											<item.icon/>
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}

export default function Layout({
	                               children
                               }: {
	children: React.ReactNode
}) {
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
				</header>
				{children}
			</main>
		</SidebarProvider>
	)
}
