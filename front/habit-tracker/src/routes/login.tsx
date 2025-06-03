import {createFileRoute} from '@tanstack/react-router'
import {LoginForm} from "@/components/login-form.tsx";
import {useAuth} from "@/hooks/auth.tsx";

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

function RouteComponent() {
	const auth = useAuth();
	const navigate = Route.useNavigate();

	async function handleLogin(username: string){
		await auth.login(username);
		await navigate({to: "/"});
	}

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm onLogin={handleLogin}/>
			</div>
		</div>

	)
}
