// redux/reducers/sellerReducer.js
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  seller: null,
  isSeller: false,
  sellers: [],
  error: null,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    // Seller authentication
    .addCase("LoadSellerRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("LoadSellerSuccess", (state, action) => {
      state.isSeller = true;
      state.isLoading = false;
      state.seller = action.payload;
      state.error = null;
    })
    .addCase("LoadSellerFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
      // state.seller = null;
    })

    // Admin - get all sellers
    .addCase("getAllSellersRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllSellersSuccess", (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
      state.error = null;
    })
    .addCase("getAllSellerFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.sellers = [];
    })

    // Clear errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
