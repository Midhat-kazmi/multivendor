import {configureStore} from '@reduxjs/toolkit';
import userReducer from "./reducers/user"
import sellerReducer from "./reducers/seller";
import { productReducer } from './reducers/product';
import { eventReducer } from './reducers/eventReducer';
import { wishlistReducer } from "./reducers/wishlist.js";
import { cartReducer } from './reducers/cart';
import { orderReducer } from "./reducers/order";


export const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
     products: productReducer,
     events: eventReducer,
     wishlist: wishlistReducer,
      cart: cartReducer,
      order: orderReducer,


  },
  devTools: process.env.NODE_ENV !== 'production',
});
export default Store;