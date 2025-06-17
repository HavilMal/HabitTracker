import {
	Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel,
	SidebarMenuItem, SidebarMenuButton, SidebarMenu, SidebarMenuSub, SidebarFooter,
} from "@/components/ui/sidebar.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CookingPot, Dumbbell, RefreshCcw, GlassWater, ChevronDown, Home} from "lucide-react"
import {Link} from "@tanstack/react-router";
import {type JSX} from "react";
import {useHabits} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

type Habit = {
	id: number;
	name: string;
	type: "bool" | "measure" | "water";
	freq_type: "daily" | "weekly" | "monthly";
	freq_value: number;
	notes?: string;
	unit?: string;
	target_value?: number;
	target_type?: string;
};

type HabitCategory = {
	name: string;
	url: string;
	icon: JSX.Element;
	habits: Habit[];
}

function HabitCategoryList({category}: { category: HabitCategory }) {
	return (
		<Collapsible defaultOpen className="group/collapsible">
			<SidebarGroup>
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton>
							{category.icon}
							{category.name}
							<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"/>
						</SidebarMenuButton>
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
					<SidebarMenuSub>
						{category.habits.length > 0 ?
							category.habits.map((habit: Habit) => (
								<SidebarMenuItem key={habit.id}>
									<SidebarMenuButton asChild>
										{/*todo refactor*/}
										<Link to={category.url + "/" + habit.id.toString()}>{habit.name}</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))
							:
							<SidebarMenuItem>
								<SidebarGroupLabel asChild>
									<p>No habits</p>
								</SidebarGroupLabel>
							</SidebarMenuItem>
						}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	)
}


export function SidebarList({list}: { list: HabitCategory[] }) {
	return (
		<SidebarGroup>
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuButton asChild>
						<Link to="/dashboard">
							<Home/>
							Dashboard
						</Link>
					</SidebarMenuButton>
				</SidebarMenu>
			</SidebarGroup>
			<SidebarGroupLabel>Habits</SidebarGroupLabel>
			{list.map((category: HabitCategory) => (
				<HabitCategoryList category={category} key={category.name}/>
			))}
		</SidebarGroup>
	)
}

function parseHabits(habits: any): HabitCategory[] {
	return [
		{
			name: "Habits",
			url: "/habit",
			icon: <RefreshCcw/>,
			habits: habits["bool"].concat(habits["measure"]),
		},
		{
			name: "Exercises",
			url: "/exercises",
			icon: <Dumbbell/>,
			habits: [],
		},
		{
			name: "Food",
			url: "/food",
			icon: <CookingPot/>,
			habits: [],
		},
		{
			name: "Water",
			url: "/water",
			icon: <GlassWater/>,
			habits: habits["water"],
		},
	]
}

function ListSkeleton() {
	return (
		<div className="flex flex-col p-2 gap-2">
			<Skeleton className="h-8 w-full"/>
			<Skeleton className="ml-2 p-2 h-8"/>
			<Skeleton className="ml-2 p-2 h-8"/>
			<Skeleton className="h-8 w-full"/>
			<Skeleton className="ml-2 p-2 h-8"/>
			<Skeleton className="ml-2 p-2 h-8"/>
		</div>
	)
}

export function AppSidebar() {
	const {isLoading, habits} = useHabits();

	return (
		<Sidebar variant="sidebar">
			<SidebarHeader>
				Habit Tracker
			</SidebarHeader>
			<SidebarContent>
				{isLoading ? <ListSkeleton/> : <SidebarList list={parseHabits(habits)}/>}
			</SidebarContent>
			<SidebarFooter>
				<Button variant="outline" asChild>
					<Link to="/create">
						Add Habit
					</Link>
				</Button>
				<Button variant="outline">Profile</Button>
			</SidebarFooter>
		</Sidebar>
	)
}
