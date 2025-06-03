import {
	Sidebar, SidebarContent, SidebarGroup, SidebarProvider,
	SidebarTrigger, SidebarGroupLabel, SidebarGroupContent, SidebarMenu,
	SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Home, CookingPot, Dumbbell, RefreshCcw, GlassWater} from "lucide-react"
import * as React from "react";
import {Link} from "@tanstack/react-router";
import {Button} from "@/components/ui/button.tsx";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {HabitListTest} from "@/components/habit-list.tsx";

const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Habit",
		url: "/habit",
		icon: RefreshCcw,
	},
	{
		title: "Activity",
		url: "/activity",
		icon: Dumbbell,
	},
	{
		title: "Meals",
		url: "/meals",
		icon: CookingPot,
	},
	{
		title: "Water",
		url: "/water",
		icon: GlassWater,
	},
]

export function AppSidebar() {
	return (
		<Sidebar variant="sidebar">
			<SidebarHeader>
				Habit Tracker
			</SidebarHeader>
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
			<HabitListTest/>
			<SidebarFooter>
				<Button variant="outline">Add Habit</Button>
				<Button variant="outline">Profile</Button>
			</SidebarFooter>
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
					<ModeToggle className="ml-auto"/>
				</header>
				{children}
			</main>
		</SidebarProvider>
	)
}
