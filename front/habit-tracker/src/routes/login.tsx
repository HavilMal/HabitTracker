import {createFileRoute, Link} from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<Button asChild>
				<Link to={"/"}>Login</Link>
			</Button>
		</div>
	)
}
