
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";

const Dashboard = () => {
  return (
    <DashboardLayout currentPage="home">
      <div className="p-6">
        <div className="rounded-3xl overflow-hidden backdrop-blur-[30px] bg-white/60 border border-white/14 shadow-neo dark:bg-slate-grey/30 dark:border-white/10 p-6 transition-all duration-160 ease-out">
          <HomeView />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
