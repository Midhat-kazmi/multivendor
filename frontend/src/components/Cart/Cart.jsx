import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { productData } from "../../static/data";

const Cart = ({ setOpenCart }) => {
  const staticCart = productData.slice(0, 2).map((item) => ({
    ...item,
    qty: 1,
    discountPrice: item.discount_price ?? item.price ?? 0,
  }));

  const [cartItems, setCartItems] = useState(staticCart);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (updatedItem) => {
    const updatedCart = cartItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setCartItems(updatedCart);
  };

  const removeFromCartHandler = (data) => {
    const updatedCart = cartItems.filter((item) => item.id !== data.id);
    setCartItems(updatedCart);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cartItems.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center flex-col px-4">
            <div className="flex w-full justify-end pt-5 pr-5">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5 className="text-lg font-medium pt-20 text-center">
              Your cart is empty!
            </h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cartItems.length} item(s)
                </h5>
              </div>

              <div className="w-full border-t">
                {cartItems.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              <Link to="/checkout">
                <div className="h-[45px] flex items-center justify-center w-full bg-[#e44343] rounded-[5px] hover:bg-[#d33434] transition">
                  <h1 className="text-white text-[18px] font-[600]">
                    Checkout Now (USD${totalPrice.toFixed(2)})
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

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = () => {
    if (data.stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      const newQty = value + 1;
      setValue(newQty);
      quantityChangeHandler({ ...data, qty: newQty });
    }
  };

  const decrement = () => {
    if (value > 1) {
      const newQty = value - 1;
      setValue(newQty);
      quantityChangeHandler({ ...data, qty: newQty });
    }
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center flex-wrap gap-4">
        <img
          src={data.image_Url[0]?.url}
          alt={data.name}
          className="w-[80px] h-[80px] object-cover rounded"
        />
        <div className="flex-1 min-w-[120px]">
          <h1 className="truncate max-w-[180px] font-medium">{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${data.discountPrice.toFixed(2)} × {value}
          </h4>
          <h4 className="font-[600] pt-1 text-[17px] text-[#d02222] font-Roboto">
            USD${totalPrice.toFixed(2)}
          </h4>
        </div>

        <div className="flex items-center">
          <HiPlus
            size={20}
            className="cursor-pointer text-[#333]"
            onClick={increment}
          />
          <span className="px-2">{value}</span>
          <HiOutlineMinus
            size={20}
            className="cursor-pointer text-[#333]"
            onClick={decrement}
          />
        </div>

        <RxCross1
          className="cursor-pointer text-red-600"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;
