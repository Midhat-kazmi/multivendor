import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const activateSeller = async () => {
      try {
        const response = await axios.post(`${server}/shop/activation`, {
          activation_token,
        });
        console.log("Seller Activation Success:", response.data);
        setSuccess(true);
        // Optional: Redirect after 3 seconds
        setTimeout(() => {
          navigate("/shop-login");
        }, 3000);
      } catch (err) {
        console.error("Seller Activation Error:", err.response?.data || err.message);
        setError(true);
      }
    };

    if (activation_token) {
      activateSeller();
    }
  }, [activation_token, navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: "500",
      }}
    >
      {error ? (
        <p style={{ color: "red" }}>Seller activation token is invalid or expired.</p>
      ) : success ? (
        <p style={{ color: "green" }}>Your seller account has been activated successfully!</p>
      ) : (
        <p>Activating your seller account...</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
