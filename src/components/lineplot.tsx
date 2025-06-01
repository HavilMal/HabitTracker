import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis} from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart"

const chartData = [
	{month: "January", desktop: 186},
	{month: "February", desktop: 305},
	{month: "March", desktop: 237},
	{month: "April", desktop: 73},
	{month: "May", desktop: 209},
	{month: "June", desktop: 214},
]

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig

export function ChartLineDefault() {
	return (
		<Card className="flex flex-1">
			<CardHeader>
				<CardTitle>Line Chart</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1">
				<ChartContainer config={chartConfig}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false}/>
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel/>}
							/>
							<Line
								dataKey="desktop"
								type="natural"
								stroke="var(--color-desktop)"
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
			{/*<CardFooter className="flex-col items-start gap-2 text-sm">*/}
			{/*	<div className="flex gap-2 leading-none font-medium">*/}
			{/*		Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />*/}
			{/*	</div>*/}
			{/*	<div className="text-muted-foreground leading-none">*/}
			{/*		Showing total visitors for the last 6 months*/}
			{/*	</div>*/}
			{/*</CardFooter>*/}
		</Card>
	)
}
