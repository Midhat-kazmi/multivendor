import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";
import { toast } from "react-toastify";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await axios.post(
            `${server}/shop/activation`,
            { activation_token },
            { withCredentials: true }
          );

          toast.success("Seller account activated successfully!");
          setTimeout(() => {
            navigate("/shop-login");
          }, 2000);
        } catch (err) {
          setError(true);
          toast.error(
            err.response?.data?.message || "Activation failed or token expired."
          );
        }
      };

      sendRequest();
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
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      {error ? (
        <p>Your activation token is expired or invalid.</p>
      ) : (
        <p>Activating your seller account, please wait...</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
