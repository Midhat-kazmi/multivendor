import {configureStore} from '@reduxjs/toolkit';
import userReducer from "./reducers/user"
import sellerReducer from "./reducers/seller";
export const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,

  },
  devTools: process.env.NODE_ENV !== 'production',
});
export default Store;