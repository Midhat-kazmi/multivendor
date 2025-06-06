import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ShopLogin from "../components/Shop/ShopLogin";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isLoading,isSeller]);

  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
