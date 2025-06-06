import { createAction } from "@reduxjs/toolkit";

// Action creators
export const addToWishlist = createAction("addToWishlist");
export const removeFromWishlist = createAction("removeFromWishlist");

// Async actions
export const addToWishlistAsync = (data) => async (dispatch, getState) => {
  dispatch(addToWishlist(data));
  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
  return data;
};

export const removeFromWishlistAsync = (data) => async (dispatch, getState) => {
  dispatch(removeFromWishlist(data._id));
  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
  return data;
};
