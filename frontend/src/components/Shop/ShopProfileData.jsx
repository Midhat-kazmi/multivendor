import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from '../Route/ProductCard/ProductCard';
import { productData } from '../../static/data'; 

const ShopProfileData = ({ isOwner }) => {
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { id: "products", label: "Shop Products" },
    { id: "events", label: "Running Events" },
    { id: "reviews", label: "Shop Reviews" },
  ];

  return (
    <div className="w-full">
      {/* Top Header: Tabs + Button */}
      <div className="w-full flex items-center justify-between mb-4">
        {/* Left: Tabs */}
        <div className="flex items-center space-x-6">
          {tabs.map((tab) => (
            <h5
              key={tab.id}
              className={`font-[600] text-[18px] cursor-pointer transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-red-500 underline underline-offset-4"
                  : "text-gray-700 hover:text-red-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </h5>
          ))}
        </div>

        {/* Right: Dashboard Button */}
        <Link
          to="/dashboard"
          className="bg-black hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
        >
          Go to Dashboard
        </Link>
      </div>

      <br />

      {/* Product Section (Visible by default) */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {productData &&
            productData.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {/* You can add similar blocks for events and reviews here */}
    </div>
  );
};

export default ShopProfileData;
