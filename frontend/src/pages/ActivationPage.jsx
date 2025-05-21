import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server"; // This is correctly set to: http://localhost:8000/api/v2

const ActivationPage = () => {
  const { activation_token } = useParams(); // Gets the token from the URL
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const activateUser = async () => {
      try {
        const response = await axios.post(`${server}/user/activation`, {
          activation_token,
        });
        console.log("Activation response:", response.data);
        setSuccess(true);
      } catch (err) {
        console.error("Activation error:", err.response?.data || err.message);
        setError(true);
      }
    };

    if (activation_token) {
      activateUser();
    }
  }, [activation_token]);

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
        <p style={{ color: "red" }}>Your activation token is invalid or expired.</p>
      ) : success ? (
        <p style={{ color: "green" }}>Your account has been activated successfully!</p>
      ) : (
        <p>Activating your account...</p>
      )}
    </div>
  );
};

export default ActivationPage;
