import {CartesianGrid, Line, LineChart, XAxis} from "recharts"
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

export const description = "A line chart"

// todo temporary
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

export function LineplotCard({title="Line Chart", description = "description", data=chartData} : {title?: string, description?: string, data?: any}) {
	return (
		<Card className="flex flex-1">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1">
				<ChartContainer className="w-full h-full !aspect-auto" config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={data}
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
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
