import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { productData } from "../static/data"; // Import product data

const ProductsPage = () => {
  const navigate = useNavigate();

  const handleProductClick = (name) => {
    const urlSafeName = name.split(" ").join("-");
    navigate(`/product/${urlSafeName}`);
  };

  return (
    <div>
      {/* Header with active heading */}
      <Header activeHeading={3} />

      {/* Products Section */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productData.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.name)}
              className="p-4 border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg border-0 outline-none"
              />
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-600">{product.price}</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
