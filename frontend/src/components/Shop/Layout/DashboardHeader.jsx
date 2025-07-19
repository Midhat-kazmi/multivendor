import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  return (
    <div className="w-full bg-white shadow sticky top-0 left-0 z-30 px-4 py-2">
      {/* Top Section (Logo + Icons) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
         <Link
               to="/"
               className="text-3xl font-extrabold tracking-tight text-pink-500 font-[Poppins] lowercase"
             >
               shopora
             </Link>
        </div>

        {/* Icon Navigation */}
        <div className="flex items-center overflow-x-auto sm:overflow-visible gap-3 sm:gap-4">
          <Link to="/dashboard-coupons">
            <AiOutlineGift
              color="#555"
              size={24}
              className="cursor-pointer hover:text-[#333]"
            />
          </Link>
          <Link to="/dashboard-events">
            <MdOutlineLocalOffer
              color="#555"
              size={24}
              className="cursor-pointer hover:text-[#333]"
            />
          </Link>
          <Link to="/dashboard-products">
            <FiShoppingBag
              color="#555"
              size={24}
              className="cursor-pointer hover:text-[#333]"
            />
          </Link>
          <Link to="/dashboard-orders">
            <FiPackage
              color="#555"
              size={24}
              className="cursor-pointer hover:text-[#333]"
            />
          </Link>
          <Link to="/dashboard-messages">
            <BiMessageSquareDetail
              color="#555"
              size={24}
              className="cursor-pointer hover:text-[#333]"
            />
          </Link>

          {/* Seller Avatar */}
          <Link to={`/shop/${seller?._id}`}>
            <img
              src={seller?.avatar?.url || "/default-avatar.png"}
              alt="Seller Avatar"
              className="w-[40px] h-[40px] rounded-full object-cover ml-2"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
