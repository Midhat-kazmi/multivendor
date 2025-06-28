import React, { useState } from "react";
import {
  AiOutlineFolderAdd,
  AiOutlineGift,
} from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { useSelector } from "react-redux";
import { BiMenuAltLeft } from "react-icons/bi";

const DashboardSideBar = ({ active, isOwner }) => {
  const { seller } = useSelector((state) => state.seller);
  const avatarUrl = seller?.avatar?.url;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-gray-700">Dashboard Menu</h1>
        <BiMenuAltLeft
          size={28}
          className="cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`bg-white shadow-sm md:sticky top-[80px] z-10 transition-all duration-300 md:block ${
          isOpen ? "block" : "hidden"
        } w-full md:w-[270px] h-[90vh] overflow-y-auto scrollbar-hide`}
      >
        <SidebarItem
          to="/dashboard"
          icon={<RxDashboard size={24} />}
          label="Dashboard"
          active={active === 1}
        />
        <SidebarItem
          to="/dashboard-orders"
          icon={<FiShoppingBag size={24} />}
          label="All Orders"
          active={active === 2}
        />
        <SidebarItem
          to="/dashboard-products"
          icon={<FiPackage size={24} />}
          label="All Products"
          active={active === 3}
        />
        <SidebarItem
          to="/dashboard-create-product"
          icon={<AiOutlineFolderAdd size={24} />}
          label="Create Product"
          active={active === 4}
        />
        <SidebarItem
          to="/dashboard-events"
          icon={<MdOutlineLocalOffer size={24} />}
          label="All Events"
          active={active === 5}
        />
        <SidebarItem
          to="/dashboard-create-event"
          icon={<VscNewFile size={24} />}
          label="Create Event"
          active={active === 6}
        />
        {isOwner && (
          <SidebarItem
            to="/dashboard-withdraw-money"
            icon={<CiMoneyBill size={24} />}
            label="Withdraw Money"
            active={active === 7}
          />
        )}
        <SidebarItem
          to="/dashboard-messages"
          icon={<BiMessageSquareDetail size={24} />}
          label="Shop Inbox"
          active={active === 8}
        />
        <SidebarItem
          to="/dashboard-coupons"
          icon={<AiOutlineGift size={24} />}
          label="Discount Codes"
          active={active === 9}
        />
        <SidebarItem
          to="/dashboard-refunds"
          icon={<HiOutlineReceiptRefund size={24} />}
          label="Refunds"
          active={active === 10}
        />
        {isOwner && (
          <SidebarItem
            to="/settings"
            icon={<CiSettings size={24} />}
            label="Settings"
            active={active === 11}
          />
        )}
      </div>
    </>
  );
};

const SidebarItem = ({ to, icon, label, active }) => (
  <div className="w-full flex items-center p-4 hover:bg-gray-50 transition">
    <Link to={to} className="w-full flex items-center">
      {React.cloneElement(icon, {
        color: active ? "crimson" : "#555",
      })}
      <h5
        className={`ml-3 text-[16px] font-medium ${
          active ? "text-[crimson]" : "text-[#555]"
        }`}
      >
        {label}
      </h5>
    </Link>
  </div>
);

export default DashboardSideBar;
