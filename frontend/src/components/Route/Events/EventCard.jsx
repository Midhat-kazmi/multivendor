import React, { useState } from "react";
import styles from "../../../styles/styles";
import CountDown from "./CountDown.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const EventCard = ({ data }) => {
  const [cart, setCart] = useState([]);

  const addToCartHandler = (data) => {
    const isItemExists = cart.find((item) => item._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        setCart([...cart, cartData]);
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-full block bg-white rounded-lg mb-12 lg:flex p-2">
      <div className="w-full lg:w-1/2 m-auto">
        <img src={data.imageUrl} alt={data.name} className="w-full h-[200px] object-cover rounded-lg" />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data.name}</h2>
        <p>{data.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data.price}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333]">{data.discount_price}$</h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data.total_sell} sold
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data._id}`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div className={`${styles.button} text-[#fff] ml-5`} onClick={() => addToCartHandler(data)}>
            Add to Cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
