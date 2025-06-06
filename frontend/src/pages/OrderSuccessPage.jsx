import React from "react";
import { useParams, Link } from "react-router-dom";

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-md shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-700 mb-6">
          Your order <span className="font-semibold">#{id}</span> has been placed.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
