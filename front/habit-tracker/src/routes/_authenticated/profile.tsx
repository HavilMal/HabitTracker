import {createFileRoute} from '@tanstack/react-router'
import {ProfileCard} from "@/components/cards/profile-card.tsx";

export const Route = createFileRoute('/_authenticated/profile')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex h-full w-full justify-center items-center">
			<ProfileCard/>
		</div>
	)
}
