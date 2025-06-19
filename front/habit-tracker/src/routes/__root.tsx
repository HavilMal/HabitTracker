import {Outlet, createRootRoute} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {useAuth} from "@/hooks/auth.tsx";
import {ErrorPage} from "@/components/error-page.tsx";
import Layout from "@/components/layout.tsx";
import {HabitsProvider} from "@/hooks/habit-provider.tsx";

export const Route = createRootRoute({
	component: () => (
		<>
			<Outlet/>
			{/*<TanStackRouterDevtools/>*/}
		</>
	),
	notFoundComponent: ErrorPageWrapper
})

function ErrorPageWrapper() {
	const auth = useAuth();
	if (auth.isAuthenticated) {
		return (
			<HabitsProvider>
				<Layout>
					<ErrorPage redirect="/dashboard"/>
				</Layout>
			</HabitsProvider>
		)
	} else {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<ErrorPage redirect="/"/>
			</div>
		)
	}
}
