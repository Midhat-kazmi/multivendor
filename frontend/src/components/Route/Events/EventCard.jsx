import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addToCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailCard";
import CountDown from "./CountDown";
import Ratings from "../../Products/Ratings";

const EventCard = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  if (!data || !data.images || !Array.isArray(data.images)) return null;

  const removeFromWishlistHandler = () => {
    setClick(false);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = () => {
    setClick(true);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = () => {
    const isItemExists = cart?.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (data.stock < 1) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addToCart({ ...data, qty: 1 }));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <>
      <div className="w-full h-[430px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        {/* Product Image */}
        <Link to={`/product/${data._id}?isEvent=true`}>
          <img
            src={data.images[0]?.url || "/fallback.jpg"}
            alt={data.name}
            className="w-full h-[170px] object-contain"
          />
        </Link>

        {/* Shop name */}
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>

        {/* Product name */}
        <Link to={`/product/${data._id}?isEvent=true`}>
          <h4 className="pb-1 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>
        </Link>

        {/* Ratings */}
        <div className="flex">
          <Ratings rating={data?.ratings} />
        </div>

        {/* Price + Sold */}
        <div className="py-2 flex items-center justify-between">
          <div className="flex">
            <h5 className={`${styles.productDiscountPrice}`}>
              ${data.discountPrice}
            </h5>
            {data.originalPrice > data.discountPrice && (
              <h4 className={`${styles.price}`}>
                ${data.originalPrice}
              </h4>
            )}
          </div>
          <span className="font-[400] text-[17px] text-[#68d284]">
            {data.sold_out} sold
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="mt-1">
          <CountDown data={data} />
        </div>

        {/* Side icons */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={removeFromWishlistHandler}
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={addToWishlistHandler}
              color="#333"
              title="Add to wishlist"
            />
          )}

          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(true)}
            color="#333"
            title="Quick view"
          />

          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={addToCartHandler}
            color="#444"
            title="Add to cart"
          />

          {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
        </div>
      </div>
    </>
  );
};

export default EventCard;
