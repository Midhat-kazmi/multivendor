import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { productData } from "../../static/data";

const Wishlist = ({ setOpenWishlist }) => {
  // Simulated wishlist (same source as Cart)
  const staticWishlist = productData.slice(0, 2);

  const [wishlistItems, setWishlistItems] = useState(staticWishlist);

  const removeFromWishlistHandler = (item) => {
    const updatedWishlist = wishlistItems.filter((i) => i.id !== item.id);
    setWishlistItems(updatedWishlist);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {wishlistItems.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Wishlist is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlistItems.length} items
                </h5>
              </div>

              <div className="w-full border-t">
                {wishlistItems.map((item, index) => (
                  <WishlistSingle
                    key={index}
                    data={item}
                    removeFromWishlistHandler={removeFromWishlistHandler}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              <Link to="/wishlist">
                <div className="h-[45px] flex items-center justify-center w-full bg-[#e44343] rounded-[5px]">
                  <h1 className="text-white text-[18px] font-[600]">
                    View Full Wishlist
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WishlistSingle = ({ data, removeFromWishlistHandler }) => {
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <img
          src={data.image_Url[0].url}
          alt=""
          className="w-[80px] h-[80px] object-cover"
        />
        <div className="pl-4 flex-1">
          <h1 className="text-[16px] font-[500]">
            {data.name.slice(0, 35)}...
          </h1>
          <h4 className="font-[400] text-[15px] text-[#00000082] mt-1">
            ${data.discount_price}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer ml-2"
          onClick={() => removeFromWishlistHandler(data)}
        />
      </div>
    </div>
  );
};

export default Wishlist;
