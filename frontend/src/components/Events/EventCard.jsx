import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/actions/cart";
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
      className={`w-full bg-white rounded-xl shadow-md overflow-hidden ${
        active ? "" : "mb-12"
      } lg:flex`}
    >
      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <img
          src={data.images[0]?.url}
          alt={data.name}
          className="w-full max-w-sm object-contain rounded-lg"
        />
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {data.name}
        </h2>
        <p className="text-gray-600 mb-4">{data.description}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h5 className="text-lg text-red-500 line-through mr-2">
              {data.originalPrice}$
            </h5>
            <h5 className="text-xl font-semibold text-gray-900">
              {data.discountPrice}$
            </h5>
          </div>
          <span className="text-green-600 text-sm">
            {data.sold_out} sold
          </span>
        </div>

        <CountDown data={data} />

        <div className="mt-4 flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className="bg-black text-white px-4 py-2 rounded hover:opacity-90 transition">
              See Details
            </button>
          </Link>
          <button
            className="bg-black text-white px-4 py-2 rounded ml-4 hover:opacity-90 transition"
            onClick={() => addToCartHandler(data)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
