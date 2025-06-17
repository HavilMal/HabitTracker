import {createFileRoute} from '@tanstack/react-router'
import {AddingCard} from "@/components/cards/adding-card.tsx";

export const Route = createFileRoute('/_authenticated/create')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center ">
			<div className="w-full max-w-sm">
				<AddingCard/>
			</div>
		</div>
	)
}
