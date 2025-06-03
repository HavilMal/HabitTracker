import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenuItem,
	SidebarMenuButton, SidebarMenu
} from "@/components/ui/sidebar.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {CookingPot, Dumbbell, RefreshCcw, GlassWater, ChevronDown} from "lucide-react"
import {type JSX} from "react";

type HabitCategory = {
	name: string;
	icon: JSX.Element;
	habits: string[];
}

function HabitCategorySublist({category}: { category: HabitCategory }) {
	return (
		<Collapsible defaultOpen className="group/collapsible">
			<SidebarGroup>
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger>
						<SidebarMenuButton>
							{category.icon}
							{category.name}
							<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
						</SidebarMenuButton>
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
					<SidebarMenu>
						{category.habits.map((habit: string) => (
							<SidebarMenuItem key={habit}>
								<SidebarMenuButton asChild>
									<p>{habit}</p>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	)
}


export function HabitList({list}: { list: HabitCategory[] }) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Habits</SidebarGroupLabel>
			{list.map((category: HabitCategory) => (
				<HabitCategorySublist category={category}/>
			))}
		</SidebarGroup>
	)
}

const data: HabitCategory[] = [
	{
		name: "Habit",
		icon: <RefreshCcw/>,
		habits: ["Meditation", "Watering plants"],
	},
	{
		name: "Activity",
		icon: <Dumbbell/>,
		habits: ["Push-ups", "Plank"],
	},
	{
		name: "Meals",
		icon: <CookingPot/>,
		habits: ["Breakfast", "Dinner"],
	},
	{
		name: "Water",
		icon: <GlassWater/>,
		habits: ["Glass"],
	},
]

export function HabitListTest() {
	return (
		<HabitList list={data}/>
	)
}