import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UsersTableSkeleton = () => {
	return (
		<div className="glass-card my-4 mx-16 rounded-sm p-4 md:p-6 bg-surface">
			<div className="flex items-center justify-between mb-4">
				<Skeleton className="h-6 w-24" />
			</div>

			<Table>
				<TableHeader>
					<TableRow className="border-white/10">
						{["Name", "Email", "Integrations", "Created Date", "Action"].map((head) => (
							<TableHead key={head} className="text-text-secondary">
								{head}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i} className="border-white/10">
							<TableCell><Skeleton className="h-4 w-24" /></TableCell>
							<TableCell><Skeleton className="h-4 w-56" /></TableCell>
							<TableCell><Skeleton className="h-4 w-10" /></TableCell>
							<TableCell><Skeleton className="h-4 w-24" /></TableCell>
							<TableCell>
								<Skeleton className="h-4 w-36 rounded-md" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default UsersTableSkeleton;
