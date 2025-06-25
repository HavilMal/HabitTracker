import {
	Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel,
	SidebarMenuItem, SidebarMenuButton, SidebarMenu, SidebarMenuSub, SidebarFooter,
} from "@/components/ui/sidebar.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CookingPot, Dumbbell, RefreshCcw, GlassWater, ChevronDown, Home, Trash} from "lucide-react"
import {Link} from "@tanstack/react-router";
import {type JSX} from "react";
import {useHabits} from "@/hooks/habit-provider.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useAuth} from "@/hooks/auth.tsx";
import {useNavigate, useParams, useRouter} from "@tanstack/react-router";
import {toast} from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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
	const {refreshHabits} = useHabits();
	const navigate = useNavigate();
	const params = useParams({strict: false})

	//todo
	async function deleteHabit(id: number) {
		try {
			const response = await fetch(import.meta.env.VITE_API_URL + "delete-habit",
				{
					credentials: "include",
					mode: "cors",
					method: "DELETE",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
					},
					body: JSON.stringify({habit_id: id}),
				})

			if (response.ok) {
				if (Number(params?.id) === id) {
					await navigate({to: "/dashboard"})
				}
				refreshHabits();
			} else {
				toast.error("Failed to delete habit");
			}
		} catch (e) {
			toast.error("Failed to delete habit", {description: "Could not connect to the server"});
		}
	}

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
								<SidebarMenuItem key={habit.id} className="flex flex-1 flex-row">
									<SidebarMenuButton asChild>
										<Link to={category.url + "/" + habit.id.toString()} className="">{habit.name}</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild className="w-[32px]">

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<SidebarMenuButton asChild className="w-[32px]">
													<Trash/>
												</SidebarMenuButton>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. It will permanently destroy all your data and you will not be
														able to recover it.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
														onClick={() => deleteHabit(habit.id)}
													>
														Confirm
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>

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
