import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  // fallback image if no avatar is available
  const avatarUrl =
    seller?.avatar?.url ||
    "https://icons8.com/icon/85120/gender-neutral-user";

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      {/* Logo */}
      <div>
        <Link to="/dashboard">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Shopo Logo"
          />
        </Link>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/cupouns">
          <AiOutlineGift color="#555" size={30} />
        </Link>
        <Link to="/dashboard-events">
          <MdOutlineLocalOffer color="#555" size={30} />
        </Link>
        <Link to="/dashboard-products">
          <FiShoppingBag color="#555" size={30} />
        </Link>
        <Link to="/dashboard-orders">
          <FiPackage color="#555" size={30} />
        </Link>
        <Link to="/dashboard-messages">
          <BiMessageSquareDetail color="#555" size={30} />
        </Link>

        {/* Avatar */}
        <Link to={`/shop/${seller?._id}`}>
          <img
            src={avatarUrl}
            alt="Seller Avatar"
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
