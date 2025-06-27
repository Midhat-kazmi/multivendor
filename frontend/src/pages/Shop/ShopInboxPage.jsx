import React from 'react';
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';
import DashboardMessages from "../../components/Shop/DashboardMessages";

const ShopInboxPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[310px]">
          <DashboardSideBar active={8} />
        </div>
        <div className="w-full justify-center flex">
          <DashboardMessages />
        </div>
      </div>
    </div>
  );
};

export default ShopInboxPage;
