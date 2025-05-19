import React, { useEffect, useState } from "react";
import { productData } from "../static/data";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = productData.slice(0, 2).map((item) => ({
      ...item,
      qty: 1,
      discountPrice: item.discount_price ?? item.price ?? 0,
    }));
    setCartItems(items);
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
          Checkout Summary
        </h2>

        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b pb-4">
              <img
                src={item.image_Url[0].url}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ${item.discountPrice.toFixed(2)} × {item.qty}
                </p>
              </div>
              <div className="text-right font-semibold text-red-500">
                USD${(item.qty * item.discountPrice).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center border-t pt-4">
          <h3 className="text-xl font-semibold">Total:</h3>
          <span className="text-xl font-bold text-red-600">
            USD${totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="mt-6">
          <Link to="/payment">
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded text-lg font-semibold">
              Continue to Payment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
