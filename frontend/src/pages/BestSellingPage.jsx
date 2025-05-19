import React, { useEffect, useState } from "react";
import { productData } from "../static/data";
import styles from "../styles/styles";
import ProductCard from "../components/Route/ProductCard/ProductCard"; 
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const sorted = productData
      .sort((a, b) => b.total_sell - a.total_sell)
      .slice(0, 10); // You can change this number
    setTopProducts(sorted);
  }, []);

  return (
    <div>
      <Header activeHeading={2} /> {/* highlight "Best Selling" in nav if applicable */}

      <div className={`${styles.section} py-10`}>
        <h1 className={`${styles.heading} mb-8`}>Best Selling Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {topProducts.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BestSellingPage;
