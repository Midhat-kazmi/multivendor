import axios from "axios";
import { server } from "../../server";

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });
    

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
      payload: error.response?.data?.message || "Failed to fetch sellers",
    });
  }
};

// Load seller data --> Login ->
 export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadSellerRequest" });

    const { data } = await axios.get(`${server}/shop/get-seller`, {
      withCredentials: true,
    });

    if (!data.shop) {
      throw new Error("No shop data received");
    }

    dispatch({
      type: "LoadSellerSuccess",
      payload: data.shop,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};
