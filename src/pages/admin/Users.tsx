import Navbar from "@/components/admin/Navbar";
import React from "react";

const Dashboard = () => {
	return (
		//Dashboard, Users, Plans, Invoices
		<div className="w-full h-screen">
            <Navbar currentPage="users" />
			<div className="w-full h-[calc(100%-40px)] bg-surface">Users</div>
		</div>
	);
};

export default Dashboard;
