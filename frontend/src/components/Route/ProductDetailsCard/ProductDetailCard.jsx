import React from "react";

const ProductDetailsCard = ({ data, setOpen }) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      <img
        src={data.image_Url[0].url}
        alt={data.name}
        className="w-full md:w-[350px] h-auto object-contain rounded"
      />
      <div>
        <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
        <p className="text-gray-700 mb-4">
          {data.description || "No description available."}
        </p>
        <div className="flex gap-3 items-center mb-4">
          <span className="text-xl font-bold text-green-600">
            {data.discount_price}$
          </span>
          {data.price && (
            <span className="line-through text-gray-400">{data.price}$</span>
          )}
        </div>
        <p className="text-sm text-gray-500">Total sold: {data.total_sell}</p>
        <p className="text-sm text-gray-500 mt-1">Shop: {data.shop.name}</p>
        <button
          onClick={() => alert("Add to cart clicked")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
        <button
          onClick={() => setOpen(false)}
          className="mt-3 ml-4 px-4 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
