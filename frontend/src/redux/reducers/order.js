// src/redux/reducers/order.js

import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  orders: [],
  adminOrders: [],
  error: null,
  adminOrderLoading: false,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // get all orders of user
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders of shop
    .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders for admin
    .addCase("adminAllOrdersRequest", (state) => {
      state.adminOrderLoading = true;
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      state.adminOrderLoading = false;
      state.error = action.payload;
    })

    .addCase("updateOrderStatusRequest", (state) => {
  state.isLoading = true;
})
.addCase("updateOrderStatusSuccess", (state, action) => {
  state.isLoading = false;
  // Optional: Update specific order in state.orders
  const updatedOrder = action.payload;
  state.orders = state.orders.map(order =>
    order._id === updatedOrder._id ? updatedOrder : order
  );
})
.addCase("updateOrderStatusFailed", (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
})

    // clear errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
