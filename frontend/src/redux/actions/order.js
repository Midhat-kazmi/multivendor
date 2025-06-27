// src/redux/actions/orderAction.js

import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";


// Get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersUserRequest" });

    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all orders of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersShopRequest" });

    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders/${shopId}`
    );

    console.log("API RESPONSE (getAllOrdersOfShop):", data); // 🪵 Add this

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all orders for admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "adminAllOrdersRequest" });

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
    });

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    dispatch({ type: "updateOrderStatusRequest" });

    const { data } = await axios.put(
      `${server}/order/update-order-status/${orderId}`,
      { status },
      { withCredentials: true }
    );

    dispatch({ type: "updateOrderStatusSuccess", payload: data.order });
    toast.success("Order status updated successfully!");
  } catch (error) {
    dispatch({
      type: "updateOrderStatusFailed",
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.response?.data?.message || "Order status update failed");
  }
};

