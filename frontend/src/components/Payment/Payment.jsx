import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Order Payment",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => orderID);
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      if (payer) {
        paypalPaymentHandler(payer);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    try {
      await axios.post(`${server}/order/create-order`, order, config);
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      navigate("/order/success");
      window.location.reload();
    } catch (error) {
      toast.error("Payment failed!");
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    try {
      await axios.post(`${server}/order/create-order`, order, config);
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      navigate("/order/success");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(2); // Default to PayPal

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      {/* PayPal Option */}
      <div className="flex w-full pb-5 border-b mb-2">
        <div
          className="w-[25px] h-[25px] rounded-full border-[3px] border-[#1d1a1ab4] flex items-center justify-center cursor-pointer"
          onClick={() => setSelect(2)}
        >
          {select === 2 && <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />}
        </div>
        <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
          Pay with PayPal
        </h4>
      </div>
      {select === 2 && (
        <div className="w-full border-b pb-5 mb-5">
          <button
            onClick={() => setOpen(true)}
            className={`${styles.button} bg-[#f63b60] text-white h-[45px] rounded-[5px] text-[18px] font-[600]`}
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Cash on Delivery */}
      <div className="flex w-full pb-5 border-b mb-2">
        <div
          className="w-[25px] h-[25px] rounded-full border-[3px] border-[#1d1a1ab4] flex items-center justify-center cursor-pointer"
          onClick={() => setSelect(3)}
        >
          {select === 3 && <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />}
        </div>
        <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
          Cash on Delivery
        </h4>
      </div>
      {select === 3 && (
        <button
          onClick={cashOnDeliveryHandler}
          className={`${styles.button} bg-[#f63b60] text-white h-[45px] rounded-[5px] text-[18px] font-[600]`}
        >
          Confirm Order
        </button>
      )}

      {open && (
        <div className="w-full mt-5">
          <PayPalScriptProvider options={{ "client-id": "test" }}>
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

// Dummy CartData for preview — replace with actual component
const CartData = ({ orderData }) => (
  <div className="bg-white p-5 rounded shadow">
    <h2 className="text-lg font-bold mb-3">Order Summary</h2>
    <p>Total Price: ${orderData?.totalPrice}</p>
  </div>
);

export default Payment;
