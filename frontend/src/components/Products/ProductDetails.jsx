import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg =  totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);


  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  return (
   <div className="bg-white">
  {data && (
    <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
      <div className="w-full py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Images */}
          <div className="w-full lg:w-[50%]">
            <img
              src={data.images[select]?.url}
              alt={data.name}
              className="w-full h-[400px] object-contain rounded shadow"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {data.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`thumbnail-${idx}`}
                  className={`h-[80px] w-[80px] object-cover border-2 rounded cursor-pointer ${
                    select === idx
                      ? "border-pink-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setSelect(idx)}
                />
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-[50%] flex flex-col justify-between space-y-6">
            <div>
              <h1 className="text-2xl font-semibold mb-2">{data.name}</h1>
              <p className="text-gray-700">{data.description}</p>
            </div>

            <div className="flex items-center gap-4 text-xl">
              <span className="font-bold text-red-600">
                ${data.discountPrice}
              </span>
              {data.originalPrice && (
                <span className="line-through text-gray-400">
                  ${data.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* Quantity controls */}
              <div className="flex items-center">
                <button
                  className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
                  onClick={decrementCount}
                >
                  -
                </button>
                <span className="bg-gray-100 px-4 py-1 border-t border-b">
                  {count}
                </span>
                <button
                  className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300"
                  onClick={incrementCount}
                >
                  +
                </button>
              </div>

              {/* Wishlist */}
              {click ? (
                <AiFillHeart
                  size={28}
                  className="text-red-500 cursor-pointer"
                  onClick={() => removeFromWishlistHandler(data)}
                />
              ) : (
                <AiOutlineHeart
                  size={28}
                  className="text-gray-600 hover:text-red-500 cursor-pointer"
                  onClick={() => addToWishlistHandler(data)}
                />
              )}
            </div>

            {/* Add to Cart */}
            <button
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 rounded hover:opacity-90 transition"
              onClick={() => addToCartHandler(data._id)}
            >
              Add to Cart <AiOutlineShoppingCart className="inline ml-2" />
            </button>

            {/* Shop Info + Message */}
            <div className="flex items-center gap-4 mt-6">
              <Link to={`/shop/preview/${data?.shop._id}`}>
                <img
                  src={data?.shop?.avatar?.url}
                  alt="Shop Avatar"
                  className="w-[50px] h-[50px] rounded-full border shadow"
                />
              </Link>
              <div>
                <Link to={`/shop/preview/${data?.shop._id}`}>
                  <h3 className="font-semibold text-lg">{data.shop.name}</h3>
                </Link>
                <p className="text-sm text-gray-600">
                  ({averageRating}/5) Ratings
                </p>
              </div>
              <button
                className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={handleMessageSubmit}
              >
                Message Seller <AiOutlineMessage className="inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Tabs - no style change needed unless you want */}
      <ProductDetailsInfo
        data={data}
        products={products}
        totalReviewsLength={totalReviewsLength}
        averageRating={averageRating}
      />
    </div>
  )}
</div>

  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No reviews yet!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;