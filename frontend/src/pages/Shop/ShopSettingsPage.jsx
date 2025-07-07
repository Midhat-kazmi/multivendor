import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSidebar";
import ShopSettings from "../../components/Shop/ShopSettings.jsx";

const ShopSettingsPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f5]">
      {/* Sticky header */}
      <DashboardHeader />

      <div className="flex w-full">
        {/* Sidebar (fixed width) */}
        <div className="w-[80px] 800px:w-[330px] bg-white shadow min-h-screen">
          <DashboardSideBar active={11} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-screen overflow-y-auto p-4">
          <ShopSettings />
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;
