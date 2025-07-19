import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    // Load user
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
   .addCase("LoadUserFail", (state, action) => {
  state.loading = false;
  state.isAuthenticated = false;
  state.user = null;

  // Only set error if there's a real message
  state.error = action.payload ?? null;
})

    // Update user info
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase("updateUserInfoFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Update address
    .addCase("updateUserAddressRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateUserAddressSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.successMessage = action.payload.successMessage;
    })
    .addCase("updateUserAddressFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Delete address
    .addCase("deleteUserAddressRequest", (state) => {
      state.loading = true;
    })
    .addCase("deleteUserAddressSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.successMessage = action.payload.successMessage;
    })
    .addCase("deleteUserAddressFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Logout
    .addCase("LogoutRequest", (state) => {
      state.loading = true;
    })
    .addCase("LogoutSuccess", (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    })
    .addCase("LogoutFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Clear errors
    .addCase("ClearErrors", (state) => {
      state.error = null;
      state.successMessage = null;
    });
});

export default userReducer;
