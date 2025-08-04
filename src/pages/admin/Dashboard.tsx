import Navbar from "@/components/admin/Navbar";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type IData = {
	usersCount: number;
};

const Dashboard = () => {
	const { call } = useApi();
	const navigate = useNavigate();
	const [data, setData] = useState<IData | null>(null);

	const fetchData = useCallback(async () => {
		const response = await call("get", `/admin/dashboard`, {
			isAdmin: true,
			toastTitle: "Failed to fetch dashboard data",
			toastDescription: "Unable to load dashboard data. Please try again.",
			returnOnFailure: false,
		});

		if (!response) {
			return;
		}

		setData({
			usersCount: response?.data?.total_users,
		});
	}, [call]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="w-full h-screen">
			<Navbar currentPage="dashboard" />
			<div className="w-full h-[calc(100%-64px)] min-h-fit bg-surface">
				<div className="max-w-screen-xl mx-auto p-4">
					<div className="p-4"></div>
					<div className=" text-2xl font-semibold">
						Welcome to Admin Panel
					</div>
					<div className="grid grid-cols-4 gap-4 py-6">
						<Card className="@container/card hover:scale-[1.02] hover:brightness-105 cursor-pointer" onClick={() => navigate("/admin/users")}>
							<CardHeader>
								<CardDescription>Total Users</CardDescription>
								<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
									{data?.usersCount || 0}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
