import {Outlet, createRootRoute} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useAuth} from "@/hooks/auth.tsx";
import {ErrorPage} from "@/components/error-page.tsx";
import Layout from "@/components/layout.tsx";

export const Route = createRootRoute({
	component: () => (
		<>
			<ThemeProvider>
				<Outlet/>
				<TanStackRouterDevtools/>
			</ThemeProvider>
		</>
	),
	notFoundComponent: ErrorPageWrapper
})

function ErrorPageWrapper() {
	const auth = useAuth();
	return (
		<ThemeProvider>
			{
				auth.isAuthenticated ?
					<Layout>
						<ErrorPage redirect="/dashboard"/>
					</Layout>
					:
					<div className="w-screen h-screen flex items-center justify-center">
						<ErrorPage redirect="/"/>
					</div>
			}
		</ThemeProvider>
	)
}
