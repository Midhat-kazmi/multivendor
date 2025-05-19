import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    // Optional: validate inputs here
    alert("Payment submitted (mock)");
  };

  const handleOrderSuccess = () => {
    const orderId = "12345"; // replace with dynamic ID if available
    navigate(`/order/success/${orderId}`);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment</h2>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name on Card</label>
            <input
              type="text"
              name="name"
              value={paymentInfo.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Expiry</label>
              <input
                type="text"
                name="expiry"
                value={paymentInfo.expiry}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="MM/YY"
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 font-medium">CVV</label>
              <input
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="123"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold text-lg"
          >
            Pay Now
          </button>
        </form>

        <button
          onClick={handleOrderSuccess}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold text-lg"
        >
          Order Success
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
