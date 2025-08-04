import Navbar from "@/components/admin/Navbar";
import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
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
import IntegrationModal from "@/components/admin/users/IntegrationModal";
import moment from "moment";
import UsersSkeleton from "@/components/admin/users/UsersSkeleton";
import { IUsers } from "../../components/admin/types";

const Users = () => {
	const { call } = useApi();
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		itemsPerPage: 10,
	});
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<IUsers[]>([]);
	const [viewIntegration, setViewIntegration] = useState({
		user: null,
		open: false,
	});

	const getUsers = useCallback(
		async (page = 1) => {
			setLoading(true);
			const response = await call(
				"get",
				`/admin/users?page=${page}&per_page=10`,
				{
					isAdmin: true,
					toastTitle: "Failed to fetch users",
					toastDescription: "Unable to load users. Please try again.",
					returnOnFailure: false,
				}
			);

			if (!response) {
				setLoading(false);
				return;
			}

			setUsers(response.data);
			setPagination((prev) => ({
				...prev,
				currentPage: response?.meta?.current_page || 1,
				totalPages: response?.meta?.last_page || 1,
			}));
			setLoading(false);
		},
		[call]
	);

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	const handleOpen = useCallback((user: IUsers) => {
		setViewIntegration({
			user,
			open: true,
		});
	}, []);

	const handleClose = useCallback(() => {
		setViewIntegration({
			user: null,
			open: false,
		});
	}, []);

	return (
		<>
			<div className="w-full h-screen">
				<Navbar currentPage="users" />
				<div className="w-full h-[calc(100%-64px)] min-h-fit bg-surface">
					<div className="p-4"></div>
					{loading ? (
						<UsersSkeleton />
					) : (
						<UsersList
							users={users}
							pagination={pagination}
							getUsers={getUsers}
							handleOpen={handleOpen}
						/>
					)}
				</div>
			</div>
			<IntegrationModal
				open={viewIntegration.open}
				onClose={handleClose}
				user={viewIntegration.user}
			/>
		</>
	);
};

interface UsersListProps {
	users: IUsers[];
	pagination: {
		currentPage: number;
		totalPages: number;
		itemsPerPage: number;
	};
	getUsers: (page: number) => void;
	handleOpen: (user: IUsers) => void;
}

const UsersList = ({ users, pagination, getUsers, handleOpen }: UsersListProps) => {
	
	return (
		<div className="max-w-screen-xl mx-auto glass-card my-4 rounded-sm p-4 md:p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text-primary">Users</h2>
			</div>
			<Table>
				<TableHeader>
					<TableRow className="border-white/10">
						{["Name", "Email", "Integrations", "Created Date", "Action"].map(
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
						{users?.length === 0 ? (
							<TableRow>
								<TableCell className="text-text-primary text-center" colSpan={5}>No users found.</TableCell>
							</TableRow>
						) : (
							users?.map((user) => (
								<TableRow
									key={user?.id}
									className="border-white/10 hover:bg-white/5"
								>
									<TableCell>{user?.name}</TableCell>
									<TableCell className="text-text-primary break-all">
										{user?.email}
									</TableCell>
									<TableCell className="text-text-primary break-all">
										{user?.integrations?.length}
									</TableCell>
									<TableCell>
										{moment(user?.created_at).format("MMMM D, YYYY")}
									</TableCell>
									<TableCell>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleOpen(user)}
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
					onPageChange={getUsers}
				/>
			)}
		</div>
	);
};

export default Users;
