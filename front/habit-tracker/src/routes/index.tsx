import {createFileRoute, Link} from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Apple, Dumbbell, RefreshCw} from "lucide-react";
import {ModeToggle} from "@/components/mode-toggle.tsx";

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<div className="min-h-screen flex">
			<div className="fixed top-4 right-4">
				<ModeToggle/>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 w-full">
				<div className="flex flex-col gap-8 h-screen justify-center items-center">
					<h1 className="scroll-m-20 text-center text-5xl font-extrabold tracking-tight text-balance">
						Habit Tracker
					</h1>
					<p className="text-lg text-gray-600 mb-6 px-4 md:px-0">
						Build better habits. Stay consistent. Achieve your goals.
					</p>
					<Button asChild>
						<Link to="/login">Get started!</Link>
					</Button>
				</div>

				<div className="flex flex-1 flex-col p-8 gap-8 justify-center items-center">
					<Card className="w-full">
						<CardHeader className="flex flex-row items-center gap-3">
							<RefreshCw/>
							<h3 className="text-3xl font-semibold mb-2">Track Your Habits</h3>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Easily log daily habits and visualize your progress over time.
							</p>
						</CardContent>
					</Card>
					<Card className="w-full">
						<CardHeader className="flex flex-row items-center gap-3">
							<Dumbbell/>
							<h3 className="text-3xl font-semibold mb-2">Stay Motivated</h3>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Get insights, streak stats as you build lasting routines.
							</p>
						</CardContent>
					</Card>
					<Card className="w-full">
						<CardHeader className="flex flex-row items-center gap-3">
							<Apple/>
							<h3 className="text-3xl font-semibold mb-2">Eat Healthy</h3>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Count calories, track your daily water intake and look into statistics about your diet.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>


	)
}
