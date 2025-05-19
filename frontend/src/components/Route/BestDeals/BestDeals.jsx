import React, { useEffect, useState } from "react";
import { productData } from "../../../static/data";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard"; 

const BestDeals = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const sorted = productData.sort((a, b) => b.total_sell - a.total_sell);
    setData(sorted.slice(0, 5));
  }, []);

  return (
    <div className={`${styles.section} py-10`}>
      <h1 className={styles.heading}>Best Deals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {data.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
};

export default BestDeals;
