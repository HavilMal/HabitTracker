import {createContext, type JSX, useContext, useState} from 'react';

interface BreadcrumbsContext {
	breadcrumbs: string[];
	addBreadcrumb: (breadcrumb: string) => void;
	setBreadcrumbs: (breadcrumbs: string[]) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContext | null>(null);

export const BreadcrumbsProvider = ({children}: { children?: JSX.Element | JSX.Element[] }) => {
		const [crumbs, setCrumbs] = useState<string[]>([]);

		function addBreadcrumb(breadcrumb: string): void {
			setCrumbs([...crumbs, breadcrumb]);
		}

		function setBreadcrumbs(breadcrumbs: string[]): void {
			setCrumbs(breadcrumbs);
		}

		return (
			<BreadcrumbsContext.Provider value={{breadcrumbs: crumbs, addBreadcrumb: addBreadcrumb, setBreadcrumbs: setBreadcrumbs}}>
				{children}
			</BreadcrumbsContext.Provider>
		);
	}
;

export function useBreadcrumbs() {
	const context = useContext(BreadcrumbsContext);
	if (!context) {
		throw new Error("useBreadcrumbs must be used within HabitProvider");
	}
	return context;
}
