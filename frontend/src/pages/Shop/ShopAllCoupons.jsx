import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSidebar'
import AllCoupons from "../../components/Shop/AllCoupons.jsx";

const ShopAllCoupouns = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex flex-col md:flex-row w-full">
        {/* Sidebar */}
        <aside className="w-full md:w-[250px] lg:w-[300px] bg-white shadow-md border-r border-gray-200">
          <DashboardSideBar active={9} />
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <AllCoupons />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ShopAllCoupouns
