
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";

const Dashboard = () => {
  return (
    <DashboardLayout currentPage="home">
      <HomeView />
    </DashboardLayout>
  );
};

export default Dashboard;
