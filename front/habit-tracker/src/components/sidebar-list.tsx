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
import {useAuth} from "@/hooks/auth.tsx";
import {useNavigate, useRouter} from "@tanstack/react-router";

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
			{list.map((category: HabitCategory, i: number) => (
				<HabitCategoryList category={category} key={i}/>
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
			name: "Activity",
			url: "/activity",
			icon: <Dumbbell/>,
			habits: habits["activity"],
		},
		{
			name: "Meals",
			url: "/meal",
			icon: <CookingPot/>,
			habits: habits["meal"],
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

	console.log("habits", habits);

	const auth = useAuth()
	const router = useRouter()
	const navigate = useNavigate()


	async function handleLogout() {
		try {
			await auth.logout()
			await router.invalidate();
		} finally {
			await navigate({to: "/"});
		}
	}

	function renderList() {
		console.log(habits)
		if (isLoading) {
			return (
				<ListSkeleton/>
			)
		} else if (habits === undefined) {
			return (
				<SidebarGroup>
					<SidebarGroupLabel asChild>
						<p>Could not load Habits</p>
					</SidebarGroupLabel>
				</SidebarGroup>
			)
		} else {
			return (
				<SidebarList list={parseHabits(habits)}/>
			)
		}
	}

	return (
		<Sidebar variant="sidebar">
			<SidebarHeader>
				Habit Tracker
			</SidebarHeader>
			<SidebarContent>
				{renderList()}
			</SidebarContent>
			<SidebarFooter>
				<Button variant="outline" asChild>
					<Link to="/create">
						Add Habit
					</Link>
				</Button>
				<div className="flex flex-row gap-6">
					<Button className="flex flex-1" variant="outline" asChild>
						<Link to="/profile">
							Profile
						</Link>
					</Button>
					<Button className="flex flex-1" variant="outline" onClick={handleLogout}>Logout</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
