import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();

  const handleSubmit = (categoryTitle) => {
    const query = encodeURIComponent(categoryTitle);
    navigate(`/products?category=${query}`);
  };

  return (
    <>
      {/* Branding Section */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md">
          {brandingData &&
            brandingData.map((item) => (
              <div key={item.id} className="flex items-start">
                {item.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className={`${styles.section} mb-12`}>
        <h2 className={`${styles.heading}`}>Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {categoriesData &&
            categoriesData.map((category) => (
              <div
                key={category.id}
                onClick={() => handleSubmit(category.title)}
                className="w-full rounded-md p-2 hover:shadow-lg transition duration-300 cursor-pointer text-center bg-white"
              >
                <img
                  src={category.image_Url}
                  alt={category.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h5 className="text-sm font-medium text-gray-700">
                  {category.title}
                </h5>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
