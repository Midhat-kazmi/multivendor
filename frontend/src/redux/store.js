import {configureStore} from '@reduxjs/toolkit';
import userReducer from "./reducers/user"
import sellerReducer from "./reducers/seller";
import { productReducer } from './reducers/product';
import { eventReducer } from './reducers/eventReducer';

export const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer

  },
  devTools: process.env.NODE_ENV !== 'production',
});
export default Store;