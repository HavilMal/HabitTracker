import {
	Card, CardContent, CardHeader, CardDescription, CardTitle
} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";

// todo better styling
export function ErrorPage({redirect}: { redirect: string }) {
	return (
		<div className="flex flex-1 items-center justify-center">
			<Card className="flex min-w-1/4 min-h-1/4">
				<CardHeader>
					<CardTitle> Something went wrong </CardTitle>
					<CardDescription>
						An error occurred while trying to retrieve this page. Or given page does not exist
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline">
						<Link to={redirect}>Get me back!</Link>
					</Button>
				</CardContent>
			</Card>
		</div>

	)
}