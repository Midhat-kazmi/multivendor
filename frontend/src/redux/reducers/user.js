import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('LoadUserRequest', (state) => {
      state.loading = true;
    })
    .addCase('LoadUserSuccess', (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
    .addCase('LoadUserFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase('ClearErrors', (state) => {
      state.error = null;
    })
    .addCase('LogoutSuccess', (state) => {
  state.user = null;
  state.isAuthenticated = false;
  state.loading = false;
})
.addCase('LogoutFail', (state, action) => {
  state.error = action.payload;
});

});

export default userReducer;
