import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card.tsx";


export function ProfileCard() {
	return (
		<Card className="flex w-full h-full lg:w-3/4 lg:h-3/4">
			<CardHeader>
				<CardTitle>Profile</CardTitle>
			</CardHeader>
			<CardContent>
				<p>username</p>
				<p>age</p>
				<p>height</p>
				<p>weight</p>
				<p>weight</p>


			</CardContent>
			<CardFooter>

			</CardFooter>
		</Card>
	)
}