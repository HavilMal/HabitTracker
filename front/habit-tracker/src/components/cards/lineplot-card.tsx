import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
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
	// todo change
	if (data === undefined) {
		return <p>No data</p>
	}

	const chartData = generateCompletionData(data);

	const maximum = chartData.reduce((max, curr) =>
		curr.completion > max.completion ? curr : max
	).completion;


	console.log("data", chartData)

	// todo change
	if (chartData.length === 0) {
		return <p>No data</p>
	}

	return (
		<Card className={cn("flex flex-1", className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1">
				<ChartContainer className="w-full h-full !aspect-auto" config={chartConfig}>
					<LineChart

						accessibilityLayer
						data={chartData}
						margin={{
							left: 0,
							right: 0,
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
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel/>}
						/>
						<Line
							dataKey="completion"
							type="natural"
							stroke="var(--chart-2)"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
