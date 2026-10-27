import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"
import {
	Command,
	CommandInput,
	CommandItem,
	CommandEmpty,
	CommandGroup,
} from "@/components/ui/command"
import {Button} from "@/components/ui/button"
import {useState} from "react"
import {Search} from "lucide-react"
import {toast} from "sonner"
import type {UseFormReturn} from "react-hook-form";
import {foodSchema, type FoodSchema} from "@/lib/from-schemas.ts";
import {capitalize} from "@/lib/utils.ts";

type SearchItem = {
	fdcId: number,
	description: string,
	brandOwner: string,
	score: number,
}

type Product = {
	name: string,
	nutrients: {
		calories: number,
		carbs: number,
		prot: number,
		fat: number,
	}
}

export default function ManualSearchDropdown({form}: {form: UseFormReturn<FoodSchema>}) {
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<SearchItem[]>([])
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)


	async function fetchResults(query: string): Promise<SearchItem[] | undefined> {
		try {
			const url = new URL(import.meta.env.VITE_API_URL + "search-food");
			url.searchParams.set("q", query);
			const response = await fetch(url.toString(),
				{
					credentials: "include",
					mode: "cors",
					method: "GET",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
					},
				})

			if (response.ok) {
				return response.json()
			} else {
				toast.error("Failed to create habit")
			}
		} catch (e) {
			toast.error("Failed to create habit", {description: "Could not connect to the server"})
		}

		return undefined;
	}


	async function fetchDetail(id: string): Promise<Product | undefined> {
		try {
			const url = new URL(import.meta.env.VITE_API_URL + "food/" + id);
			const response = await fetch(url.toString(),
				{
					credentials: "include",
					mode: "cors",
					method: "GET",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
					},
				})

			if (response.ok) {
				return response.json()
			} else {
				toast.error("Failed to create habit")
			}
		} catch (e) {
			toast.error("Failed to create habit", {description: "Could not connect to the server"})
		}

		return undefined;
	}

	const handleSearch = async () => {
		if (!query.trim()) return

		setLoading(true)
		const response = await fetchResults(query)
		console.log("foods",response)
		setResults(response ? response : [])
		setLoading(false)
		setOpen(true)
	}

	const handleSelect = async (selected: string) => {
		setQuery(results.find(value => value.fdcId === Number(selected))?.description || "")
		const response = await fetchDetail(selected)
		console.log("nut",response)
		if (response !== undefined) {
			form.reset({...response.nutrients, product_name: capitalize(query.split(",")[0])})
		}
		setOpen(false)
	}

	return (
		<div className="w-full">
			<Popover open={open} onOpenChange={setOpen}>
				{/* ✅ wrap button in PopoverTrigger */}
				<PopoverTrigger asChild>
					<div className="flex items-center space-x-2 w-full">
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Type your search..."
							className="flex-grow border border-input rounded-md px-3 py-2 text-sm shadow-sm"
						/>
						<Button onClick={handleSearch} type="button">
							<Search/>
						</Button>
					</div>
				</PopoverTrigger>

				<PopoverContent className="w-full p-0 mt-2">
					<Command className="w-full">
						{loading ? (
							<div className="p-4 text-sm text-muted-foreground">Searching...</div>
						) : results.length === 0 ? (
							<CommandEmpty>No results found.</CommandEmpty>
						) : (
							<CommandGroup>
								{results.map((item) => (
									<CommandItem key={item.fdcId} value={item.fdcId.toString()} onSelect={handleSelect}>
										{item.description}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
