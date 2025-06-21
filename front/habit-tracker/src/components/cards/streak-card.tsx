import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {type ChartConfig, ChartContainer} from "@/components/ui/chart"
import {cn} from "@/lib/utils.ts";


const chartData = [
	{browser: "days", visitors: 200, fill: "var(--color-safari)"},
]

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	safari: {
		label: "Safari",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig

export function StreakChart({className}: { className?: string }) {
	return (

		<Card className={cn("h-full flex flex-col", className)}>
			<CardHeader className="items-center pb-0">
				<CardTitle>Longest streak</CardTitle>
				<CardDescription>Your longest streak is: {""}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 justify-center items-center" >
				<ChartContainer
					config={chartConfig}
					className="flex flex-1 max-h-[250px]"
				>
					<RadialBarChart
						data={chartData}
						startAngle={0}
						endAngle={180}
						innerRadius={80}
						outerRadius={110}
					>
						<PolarGrid
							gridType="circle"
							radialLines={false}
							stroke="none"
							className="first:fill-muted last:fill-background"
							polarRadius={[86, 74]}
						/>
						<RadialBar dataKey="visitors" background cornerRadius={10}/>
						<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
							<Label
								content={({viewBox}) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-4xl font-bold"
												>
													{chartData[0].visitors.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Days
												</tspan>
											</text>
										)
									}
								}}
							/>
						</PolarRadiusAxis>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
