import Navbar from "@/components/admin/Navbar";
import { useState } from "react";

const Dashboard = () => {
	return (
		<div className="w-full h-screen">
			<Navbar currentPage="dashboard" />
			<div className="w-full h-[calc(100%-64px)] min-h-fit bg-surface">
				<div className="p-4"></div>
				dashboard
			</div>
		</div>
	);
};

export default Dashboard;
