import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);

  if (isLoading) return <div>Loading...</div>;
  return isSeller ? children : <Navigate to="/shop-login" replace />;
};

export default SellerProtectedRoute;
