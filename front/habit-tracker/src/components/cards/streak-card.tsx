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
import {useQuery} from "@tanstack/react-query";


type Streak = {
	habit_id: number,
	length_days: number,
	name: string,
	start_date: string,
	end_date: string,
}

type StreakData = {
	streaks: Streak[],
}

const chartConfig = {} satisfies ChartConfig


function calculateAngle(streak: Streak) {
	const thresholds = [
		{limit: 7, divisor: 7},
		{limit: 14, divisor: 14},
		{limit: 30, divisor: 30},
		{limit: 90, divisor: 90},
		{limit: 180, divisor: 90},
		{limit: 365, divisor: 365}
	];

	for (const {limit, divisor} of thresholds) {
		if (streak.length_days < limit) {
			return 360 * (streak.length_days / divisor);
		}
	}
	return 360 * ((streak.length_days % 365) / 365);
}


export function StreakChart({className}: { className?: string }) {

	async function featchStreaks(): Promise<StreakData> {
		const res = await fetch(import.meta.env.VITE_API_URL + "get-longest-streaks", {
			credentials: "include",
			mode: "cors",
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
				"Content-Type": "application/json; charset=utf-8",
			},
		});
		if (!res.ok) {
			throw new Error('Failed to fetch habits');
		}

		return res.json();
	}

	const {data, isLoading} = useQuery({
		queryKey: ['streak'],
		queryFn: featchStreaks,
		staleTime: 1000 * 60 * 5,
	});

	let message = ""

	if (isLoading) {
		message = "Loading..."
	} else if (data === undefined) {
		message = "Failed to load"
	}

	let maxStreak = undefined;
	let angle = undefined;
	let chartData = undefined;

	if (data !== undefined && data.streaks.length > 0) {
		maxStreak = data.streaks.reduce((max, curr) =>
			curr.length_days > max.length_days ? curr : max
		);

		angle = calculateAngle(maxStreak);


		chartData = [
			{days: maxStreak.length_days, fill: "var(--chart-2)"},
		]
	}

	return (
		<Card className={cn("h-full flex flex-col", className)}>
			<CardHeader className="items-center pb-0">
				<CardTitle>Longest streak</CardTitle>
				<CardDescription>Your longest streak is: {maxStreak?.name || ""}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 justify-center items-center">
				{data !== undefined ?
					<ChartContainer
						config={chartConfig}
						className="flex flex-1 max-h-[250px]"
					>
						<RadialBarChart
							data={chartData}
							startAngle={0}
							endAngle={angle}
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
							<RadialBar dataKey="days" background cornerRadius={10}/>
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
														{maxStreak?.length_days || 0}
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
					:
					<div className="flex p-6 justify-center">
						<p className="text-muted-foreground text-sm text-center">{message}</p>
					</div>
				}

			</CardContent>
		</Card>
	)
}
