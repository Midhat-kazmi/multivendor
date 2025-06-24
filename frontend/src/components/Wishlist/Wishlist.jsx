import React from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlistAsync } from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlistAsync(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addToCart(newData));
    setOpenWishlist(false);
  };

  return (
    <div
      className="fixed inset-0 bg-[#0000004b] z-[9999] flex justify-end"
      onClick={() => setOpenWishlist(false)}
    >
      <div
        className="bg-white w-[80%] md:w-[400px] h-full p-4 overflow-y-auto shadow-lg transform transition-transform translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center">
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">
              {wishlist.length} items
            </h5>
          </div>
          <RxCross1
            size={25}
            className="cursor-pointer"
            onClick={() => setOpenWishlist(false)}
          />
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <h5 className="text-lg text-gray-700 mt-10">
              Wishlist is empty!
            </h5>
          </div>
        ) : (
          <div className="pt-4 space-y-4">
            {wishlist.map((item, index) => (
              <WishlistItem
                key={index}
                data={item}
                removeFromWishlistHandler={removeFromWishlistHandler}
                addToCartHandler={addToCartHandler}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WishlistItem = ({
  data,
  removeFromWishlistHandler,
  addToCartHandler,
}) => {
  const totalPrice = data.discountPrice;

  return (
    <div className="flex items-center border-b pb-4">
      <RxCross1
        className="cursor-pointer mr-2 text-gray-600"
        onClick={() => removeFromWishlistHandler(data)}
      />
      <img
        src={data.images[0]?.url}
        alt={data.name}
        className="w-[100px] h-[100px] mx-2 object-contain rounded"
      />
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{data.name}</h4>
        <p className="text-[#d02222] font-bold text-[16px] mt-2">
          US${totalPrice}
        </p>
      </div>
      <BsCartPlus
        size={22}
        className="cursor-pointer text-green-600"
        title="Add to cart"
        onClick={() => addToCartHandler(data)}
      />
    </div>
  );
};

export default Wishlist;
