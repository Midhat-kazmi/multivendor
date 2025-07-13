import React from "react";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-lg shadow-sm ${
        active ? "" : "mb-12"
      } lg:flex p-4 gap-6`}
    >
      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img
          src={data.images?.[0]?.url || "/fallback.jpg"}
          alt={data.name}
          className="w-full max-w-[350px] h-auto object-contain rounded-lg"
        />
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">{data.name}</h2>
        <p className="text-gray-600 text-sm mb-3">{data.description}</p>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <h5 className="text-pink-500 line-through text-lg font-medium">
              ${data.originalPrice}
            </h5>
            <h5 className="text-gray-800 text-xl font-bold">
              ${data.discountPrice}
            </h5>
          </div>
          <span className="text-green-600 text-base font-medium">
            {data.sold_out} sold
          </span>
        </div>

        <CountDown data={data} />

        <div className="flex items-center mt-4 space-x-4">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className="bg-[#333] text-white px-5 py-2 rounded hover:bg-black transition">
              See Details
            </button>
          </Link>
          <button
            onClick={() => addToCartHandler(data)}
            className="bg-pink-500 text-white px-5 py-2 rounded hover:bg-pink-500 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
