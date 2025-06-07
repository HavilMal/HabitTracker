import {
	Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel,
	SidebarMenuItem, SidebarMenuButton, SidebarMenu, SidebarMenuSub, SidebarFooter,
} from "@/components/ui/sidebar.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CookingPot, Dumbbell, RefreshCcw, GlassWater, ChevronDown, Home} from "lucide-react"
import {Link} from "@tanstack/react-router";
import {type JSX} from "react";

type Habit = {
	id: number;
	name: string;
}

type HabitCategory = {
	id: number;
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
						{category.habits.map((habit: Habit) => (
							<SidebarMenuItem key={habit.id}>
								<SidebarMenuButton asChild>
									{/*todo refactor*/}
									<Link to={category.url + "/" + habit.id.toString()}>{habit.name}</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
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
				<HabitCategoryList category={category} key={category.id}/>
			))}
		</SidebarGroup>
	)
}

const data: HabitCategory[] = [
	{
		id: 1,
		name: "Habit",
		url: "/habit",
		icon: <RefreshCcw/>,
		habits: [
			{
				id: 1,
				name: "Meditation",
			},
			{
				id: 2,
				name: "Watering plants",
			}
		],
	},
	{
		id: 2,
		name: "Activity",
		icon: <Dumbbell/>,
		url: "/activity",
		habits: [
			{
				id: 3,
				name: "Push-ups",
			},
			{
				id: 4,
				name: "Plank",
			}
		],
	},
	{
		id: 3,
		name: "Meals",
		url: "/meals",
		icon: <CookingPot/>,
		habits: [
			{
				id: 5,
				name: "Breakfast",
			},
			{
				id: 6,
				name: "Dinner",
			}
		],
	},
	{
		id: 4,
		name: "Water",
		url: "/water",
		icon: <GlassWater/>,
		habits: [
			{
				id: 7,
				name: "Glass",
			}
		],
	},
]

export function AppSidebar() {
	return (
		<Sidebar variant="sidebar">
			<SidebarHeader>
				Habit Tracker
			</SidebarHeader>
			<SidebarContent>
				<SidebarList list={data}/>
			</SidebarContent>
			<SidebarFooter>
				<Button variant="outline">Add Habit</Button>
				<Button variant="outline">Profile</Button>
			</SidebarFooter>
		</Sidebar>
	)
}
