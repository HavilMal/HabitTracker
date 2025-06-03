import {
	Card,
	CardContent, CardFooter,
} from "@/components/ui/card"
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button.tsx";

type Item = {
	id: string
	name: string
	amount: number
	unit: string
}

// todo temporary
const data: Item[] = [
	{
		id: "akj",
		name: "medytacja",
		amount: 5,
		unit: "min"
	},
	{
		id: "askj",
		name: "medytacja",
		amount: 5,
		unit: "min"
	},
	{
		id: "lksaj",
		name: "medytacja",
		amount: 5,
		unit: "min"
	},
]

const columns: ColumnDef<Item>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "amount",
		header: "Amount",
	},
	{
		accessorKey: "unit",
		header: "Unit",
	}
]

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

function DataTable<TData, TValue>({columns, data,}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
								</TableHead>
							)
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
							<TableCell>
								<Button variant="destructive">Delete</Button>
							</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

export default function ItemListCard() {
	return (
		<Card className="flex flex-1">
			<CardContent className="flex flex-1">
				<DataTable columns={columns} data={data}/>
			</CardContent>
			<CardFooter>
				<Button variant="outline" className="w-full">Add Item</Button>
			</CardFooter>
		</Card>
	)
}