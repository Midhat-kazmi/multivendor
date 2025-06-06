import {configureStore} from '@reduxjs/toolkit';
import userReducer from "./reducers/user"
import { productReducer } from './reducers/product';
import { eventReducer } from './reducers/eventReducer';
import { wishlistReducer } from "./reducers/wishlist.js";
import { cartReducer } from './reducers/cart';
import { orderReducer } from "./reducers/order";
import { sellerReducer } from './reducers/seller';

export const Store = configureStore({
  reducer: {
    user: userReducer,
     products: productReducer,
     events: eventReducer,
     wishlist: wishlistReducer,
      cart: cartReducer,
      order: orderReducer,
      seller: sellerReducer,


  },
  devTools: process.env.NODE_ENV !== 'production',
});
export default Store;