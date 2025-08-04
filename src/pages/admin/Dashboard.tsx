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

type IData = {
	usersCount: number;
};

const Dashboard = () => {
	const { call } = useApi();
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
			usersCount: response.data.total_users,
		});
	}, [call]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="w-full h-screen">
			<Navbar currentPage="dashboard" />
			<div className="w-full h-[calc(100%-64px)] min-h-fit bg-surface">
				<div className="p-4"></div>
				<div className="ml-16 text-2xl font-semibold">
					Welcome to Admin Panel
				</div>
				<div className="grid grid-cols-4 gap-4 p-6 mx-16 my-4">
					<Card className="@container/card hover:scale-[1.02] hover:brightness-105">
						<CardHeader>
							<CardDescription>Total Users</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{data?.usersCount}
							</CardTitle>
						</CardHeader>
						{/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="line-clamp-1 flex gap-2 font-medium">
								320 new this month
							</div>
							<div className="text-muted-foreground">
								Signups over the last 6 months
							</div>
						</CardFooter> */}
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
