import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import axios from "axios";
import { server } from "../../server"; // make sure this path is correct

const ShopInfo = ({ isOwner, isLoading, data, products }) => {
  // Calculate total reviews count
  const totalReviewsLength =
    products?.reduce((acc, product) => acc + product.reviews.length, 0) || 0;

  // Calculate total ratings sum across all reviews of all products
  const totalRatings =
    products?.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    ) || 0;

  // Calculate average rating (handle division by zero)
  const averageRating = totalReviewsLength
    ? totalRatings / totalReviewsLength
    : 0;

  // Placeholder values
  const placeholderAddress = "123 Random St, Some City";
  const placeholderPhone = "+1 (555) 123-4567";
  const placeholderDescription = "This is a default shop description.";
  const placeholderName = "Default Shop Name";
  const placeholderDate = "2023-01-01";

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {/* Shop Avatar, Name and Description */}
          <div className="w-full py-5">
            <div className="w-full flex items-center justify-center">
              <img
                src={data?.avatar?.url || "https://via.placeholder.com/150"}
                alt="Shop Avatar"
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">
              {data?.name || placeholderName}
            </h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data?.description || placeholderDescription}
            </p>
          </div>

          {/* Address */}
          <div className="p-3">
            <h5 className="font-[600]">Address</h5>
            <h4 className="text-[#000000a6]">
              {data?.address?.trim() ? data.address : placeholderAddress}
            </h4>
          </div>

          {/* Phone Number */}
          <div className="p-3">
            <h5 className="font-[600]">Phone Number</h5>
            <h4 className="text-[#000000a6]">
              {data?.phoneNumber?.trim() ? data.phoneNumber : placeholderPhone}
            </h4>
          </div>

          {/* Total Products */}
          <div className="p-3">
            <h5 className="font-[600]">Total Products</h5>
            <h4 className="text-[#000000a6]">{products?.length || 0}</h4>
          </div>

          {/* Shop Ratings */}
          <div className="p-3">
            <h5 className="font-[600]">Shop Ratings</h5>
            <h4 className="text-[#000000b0]">{averageRating.toFixed(1)}/5</h4>
          </div>

          {/* Joined On */}
          <div className="p-3">
            <h5 className="font-[600]">Joined On</h5>
            <h4 className="text-[#000000b0]">
              {data?.createdAt ? data.createdAt.slice(0, 10) : placeholderDate}
            </h4>
          </div>

          {/* Owner-only buttons */}
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                >
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>

              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                onClick={logoutHandler}
              >
                <span className="text-white">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;
