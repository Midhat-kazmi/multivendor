import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { useSelector } from "react-redux";

const DashboardSideBar = ({ active, isOwner }) => {
  const { seller } = useSelector((state) => state.seller);

  // Adjusted to match your seller avatar structure
  const avatarUrl = seller?.avatar?.url;

  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {/* Avatar Section */}
      

      {/* Sidebar items */}
      <SidebarItem to="/dashboard" icon={<RxDashboard size={30} />} label="Dashboard" active={active === 1} />
      <SidebarItem to="/dashboard-orders" icon={<FiShoppingBag size={30} />} label="All Orders" active={active === 2} />
      <SidebarItem to="/dashboard-products" icon={<FiPackage size={30} />} label="All Products" active={active === 3} />
      <SidebarItem to="/dashboard-create-product" icon={<AiOutlineFolderAdd size={30} />} label="Create Product" active={active === 4} />
      <SidebarItem to="/dashboard-events" icon={<MdOutlineLocalOffer size={30} />} label="All Events" active={active === 5} />
      <SidebarItem to="/dashboard-create-event" icon={<VscNewFile size={30} />} label="Create Event" active={active === 6} />
      {isOwner && (
        <SidebarItem to="/dashboard-withdraw-money" icon={<CiMoneyBill size={30} />} label="Withdraw Money" active={active === 7} />
      )}
      <SidebarItem to="/dashboard-messages" icon={<BiMessageSquareDetail size={30} />} label="Shop Inbox" active={active === 8} />
      <SidebarItem to="/dashboard-coupouns" icon={<AiOutlineGift size={30} />} label="Discount Codes" active={active === 9} />
      <SidebarItem to="/dashboard-refunds" icon={<HiOutlineReceiptRefund size={30} />} label="Refunds" active={active === 10} />
      {isOwner && (
        <SidebarItem to="/settings" icon={<CiSettings size={30} />} label="Settings" active={active === 11} />
      )}
    </div>
  );
};

const SidebarItem = ({ to, icon, label, active }) => (
  <div className="w-full flex items-center p-4">
    <Link to={to} className="w-full flex items-center">
      {React.cloneElement(icon, { color: active ? "crimson" : "#555" })}
      <h5 className={`800px:block pl-2 text-[18px] font-[400] ${active ? "text-[crimson]" : "text-[#555]"}`}>
        {label}
      </h5>
    </Link>
  </div>
);

export default DashboardSideBar;
