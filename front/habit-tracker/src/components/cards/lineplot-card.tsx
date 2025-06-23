import {CartesianGrid,  Line, LineChart, XAxis, YAxis} from "recharts"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart.tsx"
import {cn, generateCompletionData} from "@/lib/utils.ts";
import type {ActivityHabit, BoolHabit, MealHabit, MeasureHabit, WaterHabit} from "@/hooks/habit-provider.tsx";

const chartConfig = {
	completion: {
		label: "Completion",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig


export type Completion = {
	date: string,
	completion: number
}

export function LineplotCard({title = "Line Chart", description = "description", data, className = ""}: {
	title?: string,
	description?: string,
	data?: BoolHabit | MeasureHabit | WaterHabit | ActivityHabit | MealHabit,
	className?: string
}) {

	let errorMessage = "No entries yet"
	let chartData: Completion[]  = []
	if (data !== undefined) {
		chartData = generateCompletionData(data)
	} else {
		errorMessage = "Failed to load"
	}


	return (
		<Card className={cn("flex flex-1", className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1">
				{chartData.length === 0 ?
					<div className="flex flex-1 justify-center items-center">
						<p className="text-muted-foreground text-sm text-center">{errorMessage}</p>
					</div>
					:
					<ChartContainer className="w-full h-full !aspect-auto" config={chartConfig}>
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 0,
								right: 60,
							}}
						>
							<CartesianGrid vertical={false}/>
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
							/>
							<YAxis
								tick={false}
								domain={[0, 'dataMax + 10']}
								tickLine={true}
								axisLine={false}
								// hide={true}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel/>}
							/>
							<Line
								dataKey="completion"
								type="bump"
								stroke="var(--chart-2)"
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ChartContainer>
				}
			</CardContent>
		</Card>
	)
}
