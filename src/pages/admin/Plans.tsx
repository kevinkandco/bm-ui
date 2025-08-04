import Navbar from "@/components/admin/Navbar";
import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
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
import moment from "moment";
import UsersSkeleton from "@/components/admin/users/UsersSkeleton";

const Plans = () => {
	const { call } = useApi();
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		itemsPerPage: 10,
	});
	const [loading, setLoading] = useState(false);
	const [plans, setPlans] = useState([]);
	const [viewIntegration, setViewIntegration] = useState({
		user: null,
		open: false,
	});

	const getPlans = useCallback(
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
		getPlans();
	}, [getPlans]);
	return (
		<>
			<div className="w-full h-screen">
				<Navbar currentPage="plans" />
				<div className="w-full h-[calc(100%-64px)] min-h-fit bg-surface">
					<div className="p-4"></div>
					{loading ? (
						<UsersSkeleton />
					) : (
						<PlansList
							plans={plans}
							pagination={pagination}
							getPlans={getPlans}
						/>
					)}
				</div>
			</div>
		</>
	);
};

interface PlansListProps {
	plans: any[];
	pagination: {
		currentPage: number;
		totalPages: number;
		itemsPerPage: number;
	};
	getPlans: (page: number) => void;
}

const PlansList = ({
	plans,
	pagination,
	getPlans,
}: PlansListProps) => {
	return (
		<div className="max-w-screen-xl mx-auto glass-card my-4 rounded-sm p-4 md:p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text-primary">Plans</h2>
			</div>
			<Table>
				<TableHeader>
					<TableRow className="border-white/10">
						{["Name", "price", "type", "Created Date", "Action"].map(
							(head) => (
								<TableHead key={head} className="text-text-secondary">
									{head}
								</TableHead>
							)
						)}
					</TableRow>
				</TableHeader>
				{
					<TableBody>
						{plans?.length === 0 ? (
							<TableRow>
								<TableCell
									className="text-text-primary text-center"
									colSpan={5}
								>
									No plans found.
								</TableCell>
							</TableRow>
						) : (
							plans?.map((plan) => (
								<TableRow
									key={plan?.id}
									className="border-white/10 hover:bg-white/5"
								>
									<TableCell>{plan?.name}</TableCell>
									<TableCell className="text-text-primary break-all">
										{plan?.email}
									</TableCell>
									<TableCell className="text-text-primary break-all">
										{plan?.integrations?.length}
									</TableCell>
									<TableCell>
										{moment(plan?.created_at).format("MMMM D, YYYY")}
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
					onPageChange={getPlans}
				/>
			)}
		</div>
	);
};

export default Plans;
