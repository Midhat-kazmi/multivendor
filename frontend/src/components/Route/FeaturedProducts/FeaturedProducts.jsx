import React from "react";
import { productData } from "../../../static/data";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProducts = () => {
  const itemsToShow = 10; // or 10
  const visibleProducts = productData.slice(0, itemsToShow);

  return (
    <div className="w-full bg-white py-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard data={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
