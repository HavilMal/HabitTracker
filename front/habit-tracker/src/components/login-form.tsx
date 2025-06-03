import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

export function LoginForm({onLogin}: {onLogin: (username: string) => Promise<void>}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
			</CardHeader>
			<CardContent>
				<Button variant="outline" onClick={() => onLogin("test")}>Login</Button>
			</CardContent>
		</Card>
	)
}