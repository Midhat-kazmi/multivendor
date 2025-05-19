import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import { productData } from "../static/data";

const ProductDetailsPage = () => {
  const { name } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (name) {
      const productName = name.replace(/-/g, " ");
      const foundProduct = productData.find((item) => item.name === productName);
      setData(foundProduct || null);
    }
  }, [name]);

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="min-h-screen py-8 px-4">
        {data ? (
          <ProductDetails data={data} />
        ) : (
          <p className="text-center text-red-500">Product not found</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
