import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";
import Layout from "@/components/layout.tsx";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({context}) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/login"
			})
		}
	},
	component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
	return (
		<Layout>
			<Outlet/>
		</Layout>
	)
}