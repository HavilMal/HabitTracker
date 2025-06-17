import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";
import Layout from "@/components/layout.tsx";
import {HabitsProvider} from "@/hooks/habit-provider.tsx";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({context}) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/login"
			})
		}
	},
	component: AuthenticatedLayout,
	notFoundComponent: NotFoundAuthenticatedLayout,
})

function NotFoundAuthenticatedLayout() {
	return (
		<HabitsProvider>
			<Layout>
				<p>Not found</p>
			</Layout>
		</HabitsProvider>
	)
}

function AuthenticatedLayout() {
	return (
		<HabitsProvider>
			<Layout>
				<Outlet/>
			</Layout>
		</HabitsProvider>
	)
}