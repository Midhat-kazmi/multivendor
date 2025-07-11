import axios from "axios";
import { server } from "../../server";

// Create Product 
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${server}/product/create-product`,
      JSON.stringify(productData),
      config
    );

    dispatch({ type: "productCreateSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};


// Get All Products of a Shop 
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });
    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`,
      { withCredentials: true } //  key fix to preserve auth
    );
    dispatch({ type: "getAllProductsShopSuccess", payload: data.products });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Product 
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });
    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      { withCredentials: true }
    );
    dispatch({ type: "deleteProductSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Products (Public/Admin)
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });
    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({ type: "getAllProductsSuccess", payload: data.products });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
