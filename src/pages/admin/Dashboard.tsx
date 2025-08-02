import Navbar from "@/components/admin/Navbar";
import { ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/dashboard/Pagination";
import { useState } from "react";

export const usersData = [
	{
		id: 1,
		name: "Alice Johnson",
		email: "alice.johnson@example.com",
		integrations: 3,
		created: "2025-07-20",
		viewIntegrations: "/admin/users/1/integrations",
	},
	{
		id: 2,
		name: "Bob Smith",
		email: "bob.smith@example.com",
		integrations: 1,
		created: "2025-07-15",
		viewIntegrations: "/admin/users/2/integrations",
	},
	{
		id: 3,
		name: "Charlie Davis",
		email: "charlie.davis@example.com",
		integrations: 5,
		created: "2025-06-30",
		viewIntegrations: "/admin/users/3/integrations",
	},
	{
		id: 4,
		name: "Diana Evans",
		email: "diana.evans@example.com",
		integrations: 2,
		created: "2025-07-10",
		viewIntegrations: "/admin/users/4/integrations",
	},
	{
		id: 5,
		name: "Ethan Martinez",
		email: "ethan.martinez@example.com",
		integrations: 4,
		created: "2025-07-25",
		viewIntegrations: "/admin/users/5/integrations",
	},
];

const Dashboard = () => {
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 10,
		itemsPerPage: 10,
	});
	return (
		<div className="w-full h-screen">
			<Navbar currentPage="dashboard" />
			<div className="w-full h-[calc(100%-64px)] min-h-fit bg-surface">
				<div className="p-4"></div>
				<div className="glass-card my-4 mx-16 rounded-sm p-4 md:p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-text-primary">Users</h2>
					</div>
					<Table>
						<TableHeader>
							<TableRow className="border-white/10">
								<TableHead className="text-text-secondary">Name</TableHead>
								<TableHead className="text-text-secondary">Email</TableHead>
								<TableHead className="text-text-secondary">
									Integrations
								</TableHead>
								<TableHead className="text-text-secondary">
									Created Date
								</TableHead>
								<TableHead className="text-text-secondary">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{usersData?.map((message) => (
								<TableRow
									key={message.id}
									className="border-white/10 hover:bg-white/5"
								>
									<TableCell>{message.name}</TableCell>
									<TableCell className="text-text-primary break-all">
										{message.email}
									</TableCell>
									<TableCell className="text-text-secondary break-all">
										{message.integrations}
									</TableCell>
									<TableCell className="px-1">{message?.created}</TableCell>
									<TableCell className="px-1">
										<Button
											variant="outline"
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
											}}
											className="text-xs px-2 py-1 h-auto ml-2"
										>
											<Eye className="h-3 w-3" />
											View Integrations
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Pagination
						currentPage={pagination.currentPage}
						totalPages={pagination.totalPages}
						onPageChange={(e) => {
                            setPagination({
                                ...pagination,
                                currentPage: e,
                            });
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
