import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  return (
    <div
      className="fixed inset-0 bg-[#0000004b] z-[9999] flex justify-end"
      onClick={() => setOpenCart(false)}
    >
      <div
        className="bg-white w-[80%] md:w-[400px] h-full p-4 overflow-y-auto shadow-lg transform transition-transform translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center">
            <IoBagHandleOutline size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">
              {cart.length} items
            </h5>
          </div>
          <RxCross1
            size={25}
            className="cursor-pointer"
            onClick={() => setOpenCart(false)}
          />
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <h5 className="text-lg text-gray-700 mt-10">Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="pt-4 space-y-4">
              {cart.map((item, index) => (
                <CartSingle
                  key={index}
                  data={item}
                  quantityChangeHandler={quantityChangeHandler}
                  removeFromCartHandler={removeFromCartHandler}
                />
              ))}
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <Link to="/checkout">
                <button
                  className="w-full bg-[#E75480] text-white py-2 rounded font-semibold text-[18px]"
                  onClick={() => setOpenCart(false)}
                >
                  Checkout NOW (USD${totalPrice})
                </button>
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

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      quantityChangeHandler({ ...data, qty: value + 1 });
    }
  };

  const decrement = (data) => {
    const newQty = value === 1 ? 1 : value - 1;
    setValue(newQty);
    quantityChangeHandler({ ...data, qty: newQty });
  };

  return (
    <div className="flex items-center border-b pb-4">
      <div className="flex flex-col items-center">
        <button
          className="bg-[#e44343] text-white rounded-full w-[25px] h-[25px] flex items-center justify-center"
          onClick={() => increment(data)}
        >
          <HiPlus size={18} />
        </button>
        <span className="my-2">{value}</span>
        <button
          className="bg-gray-200 rounded-full w-[25px] h-[25px] flex items-center justify-center"
          onClick={() => decrement(data)}
        >
          <HiOutlineMinus size={16} />
        </button>
      </div>
      <img
        src={data.images[0]?.url}
        alt={data.name}
        className="w-[100px] h-[100px] mx-4 object-contain rounded"
      />
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{data.name}</h4>
        <p className="text-gray-500 text-sm">
          ${data.discountPrice} × {value}
        </p>
        <p className="text-[#d02222] font-bold text-[16px]">
          US${totalPrice}
        </p>
      </div>
      <RxCross1
        className="cursor-pointer text-gray-600"
        onClick={() => removeFromCartHandler(data)}
      />
    </div>
  );
};

export default Cart;
