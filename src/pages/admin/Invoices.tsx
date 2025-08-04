import Navbar from "@/components/admin/Navbar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/dashboard/Pagination";
import moment from "moment";
import UsersSkeleton from "@/components/admin/users/UsersSkeleton";
import { Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";

const Dashboard = () => {
	const { call } = useApi();
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		itemsPerPage: 10,
	});
	const [loading, setLoading] = useState(false);
	const [invoices, setInvoices] = useState([]);

		const getInvoice = useCallback(
			async (page = 1) => {
				setLoading(true);
				// const response = await call(
				// 	"get",
				// 	`/admin/users?page=${page}&per_page=10`,
				// 	{
				// 		isAdmin: true,
				// 		toastTitle: "Failed to fetch users",
				// 		toastDescription: "Unable to load users. Please try again.",
				// 		returnOnFailure: false,
				// 	}
				// );
	
				// if (!response) {
				// 	setLoading(false);
				// 	return;
				// }
	
				// setPlans(response.data);
				// setPagination((prev) => ({
				// 	...prev,
				// 	currentPage: response?.meta?.current_page || 1,
				// 	totalPages: response?.meta?.last_page || 1,
				// }));
				setLoading(false);
			},
			[]
		);
	
		useEffect(() => {
			getInvoice();
		}, [getInvoice]);

	return (
		<div className="w-full h-screen">
			<Navbar currentPage="invoice" />
			<div className="w-full h-[calc(100%-64px)] min-h-fit bg-surface">
					<div className="p-4"></div>
					{loading ? (
						<UsersSkeleton />
					) : (
						<InvoiceList
							invoices={invoices}
							pagination={pagination}
							getInvoice={getInvoice}
						/>
					)}
				</div>
		</div>
	);
};

interface InvoiceListProps {
	invoices : any[];
	pagination: {
		currentPage: number;
		totalPages: number;
		itemsPerPage: number;
	};
	getInvoice: (page: number) => void;
}

const InvoiceList = ({ invoices: invoices , pagination, getInvoice }: InvoiceListProps) => {
	return (
		<div className="max-w-screen-xl mx-auto glass-card my-4 rounded-sm p-4 md:p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text-primary">Invoices</h2>
			</div>
			<Table>
				<TableHeader>
					<TableRow className="border-white/10">
						{[
							"Invoice No",
							"user",
							"description",
							"paid amount",
							"discount amount",
							"invoice date",
						].map((head) => (
							<TableHead key={head} className="text-text-secondary">
								{head}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				{
					<TableBody>
						{invoices ?.length === 0 ? (
							<TableRow>
								<TableCell
									className="text-text-primary text-center"
									colSpan={6}
								>
									No invoices found.
								</TableCell>
							</TableRow>
						) : (
							invoices ?.map((invoice) => (
								<TableRow
									key={invoice?.id}
									className="border-white/10 hover:bg-white/5"
								>
									<TableCell>{invoice?.name}</TableCell>
									<TableCell className="text-text-primary break-all">
										{invoice?.email}
									</TableCell>
									<TableCell className="text-text-primary break-all">
										{invoice?.integrations?.length}
									</TableCell>
									<TableCell>
										{moment(invoice?.created_at).format("MMMM D, YYYY")}
									</TableCell>
									<TableCell>
										<Button
											variant="outline"
											size="sm"
											className="text-xs px-2 py-1 h-auto ml-2"
										>
											<Eye className="h-3 w-3" />
											View Integrations
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				}
			</Table>
			{pagination.totalPages > 1 && (
				<Pagination
					currentPage={pagination.currentPage}
					totalPages={pagination.totalPages}
					onPageChange={getInvoice}
				/>
			)}
		</div>
	);
};

export default Dashboard;
