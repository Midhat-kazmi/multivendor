// src/App.jsx
import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventPage,
  FAQ,
  ProductDetailsPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  ProfilePage,
  ShopCreate,
  SellerActivationPage,
  ShopLoginPage,
} from "./routes/Routes";
import { ShopDashboardPage } from "./routes/ShopRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import { useDispatch } from "react-redux";
import { loadUser, loadSeller } from "./redux/actions/user";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ShopHomePage } from "./ShopRoutes";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadSeller());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/activation/:activation_token"
            element={<ActivationPage />}
          />
          <Route
            path="/shop/activation/:activation_token"
            element={<SellerActivationPage />}
          />

          {/* Protected routes */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:name" element={<ProductDetailsPage />} />
          <Route path="/best-Selling" element={<BestSellingPage />} />
          <Route path="/Events" element={<EventPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order/success/:id" element={<OrderSuccessPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Shop routes */}
          <Route path="/shop-create" element={<ShopCreate />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route
            path="/shop/:id"
            element={
              <SellerProtectedRoute>
                <ShopHomePage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SellerProtectedRoute>
                <ShopDashboardPage />
              </SellerProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </BrowserRouter>
    </>
  );
};

export default App;
