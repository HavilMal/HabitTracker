import {ModeToggle} from "@/components/mode-toggle.tsx";
import {type JSX} from "react";

export function Navbar({children}: { children?: JSX.Element | JSX.Element[] }) {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">

			{children}
			<ModeToggle className="ml-auto"/>
		</header>
	)
}