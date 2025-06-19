import {ModeToggle} from "@/components/mode-toggle.tsx";
import {type JSX} from "react";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb.tsx";

export function Navbar({children}: { children?: JSX.Element | JSX.Element[] }) {
	const {breadcrumbs} = useBreadcrumbs();
	let key = 0;
	const list = [];

	for (let i = 0; i < breadcrumbs.length; i++) {
		if (i !== breadcrumbs.length - 1) {
			list.push(<BreadcrumbItem key={key++}>{breadcrumbs[i]}</BreadcrumbItem>);
			list.push(<BreadcrumbSeparator key={key++}/>);
		} else {
			list.push(<BreadcrumbItem key={key++}>{breadcrumbs[i]}</BreadcrumbItem>);
		}
	}
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			{children}

			<Breadcrumb>
				<BreadcrumbList>
					{list}
				</BreadcrumbList>
			</Breadcrumb>

			<ModeToggle className="ml-auto"/>
		</header>
	)
}