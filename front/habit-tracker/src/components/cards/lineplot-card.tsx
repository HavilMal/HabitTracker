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
import {cn, type Stats} from "@/lib/utils.ts";

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

export function LineplotCard(
	{
		title = "Line Chart",
		description = "description",
		chartData,
		className = "",
		domainMax = 1.1,
		accessKey,
	}: {
		title?: string,
		description?: string,
		className?: string
		chartData: Stats | undefined,
		domainMax?: number,
		accessKey: keyof Stats,
	}) {

	let errorMessage = "No entries yet"
	if (chartData === undefined) {
		errorMessage = "Failed to load"
	}

	const shouldShowError = chartData === undefined || chartData[accessKey].length === 0;

	return (
		<Card className={cn("flex flex-1", className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1">
				{shouldShowError ?
					<div className="flex flex-1 justify-center items-center">
						<p className="text-muted-foreground text-sm text-center">{errorMessage}</p>
					</div>
					:
					<ChartContainer className="w-full h-full !aspect-auto" config={chartConfig}>
						<LineChart
							accessibilityLayer
							data={chartData[accessKey]}
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
								domain={[0, domainMax]}
								tickLine={true}
								axisLine={false}
							/>
							{/*todo style*/}
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel valueFormatter={(value) => `${value}%`}/>}
							/>
							<Line
								dataKey="percentage"
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
