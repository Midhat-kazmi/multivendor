import React, { useState } from "react";
import { categoriesData } from "../../static/data";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Dropdown = () => {
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (title) => {
    const encodedTitle = encodeURIComponent(title);
    navigate(`/products?category=${encodedTitle}`);
    setDropDown(false); // optional: close dropdown on click
  };

  return (
    <div
      className="relative h-[60px] flex items-center cursor-pointer"
      onMouseEnter={() => setDropDown(true)}
      onMouseLeave={() => setDropDown(false)}
    >
      <div className="flex items-center gap-1 text-white font-medium px-4">
        All Categories <IoIosArrowDown />
      </div>
      {dropDown && (
        <div className="absolute top-[60px] left-0 w-[270px] bg-white z-50 rounded shadow-md">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.title)}
              className="flex items-center gap-2 p-3 hover:bg-gray-100 transition cursor-pointer"
            >
              <img
                src={category.image_Url}
                alt={category.title}
                className="w-[30px] h-[30px] object-cover rounded-full"
              />
              <span className="text-sm text-gray-700">{category.title}</span>
              <IoIosArrowForward className="ml-auto text-gray-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
