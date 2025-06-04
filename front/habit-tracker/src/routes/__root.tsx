import {Outlet, createRootRoute} from '@tanstack/react-router'
// import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import Layout from "@/components/layout.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

export const Route = createRootRoute({
	component: () => (
		<>
				<ThemeProvider>
					{/*<Layout>*/}
						<Outlet/>
					{/*</Layout>*/}
					{/*<TanStackRouterDevtools />*/}
				</ThemeProvider>
		</>
	),
})
