
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";

const Dashboard = () => {
  return (
    <DashboardLayout currentPage="home">
      <div className="p-6">
        <div className="rounded-3xl overflow-hidden backdrop-blur-md bg-white-20 border border-white-30 shadow-xl p-6">
          <HomeView />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
