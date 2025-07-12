// src/redux/actions/event.js
import axios from "axios";
import { server } from "../../server";

// ================== CREATE EVENT ==================
export const createEvent = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(`${server}/event/create-event`, formData, config);

    dispatch({ type: "eventCreateSuccess", payload: data.event });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ================== GET EVENTS BY SHOP ==================
export const getAllEventsShop = (shopId) => async (dispatch) => {
  try {
    if (!shopId) return;

    dispatch({ type: "getAllEventsShopRequest" });

    const { data } = await axios.get(`${server}/event/get-all-events/${shopId}`, {
      withCredentials: true,
    });

    dispatch({ type: "getAllEventsShopSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "getAllEventsShopFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ================== DELETE EVENT ==================
export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    dispatch({ type: "deleteEventRequest" });

    const { data } = await axios.delete(`${server}/event/delete-shop-event/${eventId}`, {
      withCredentials: true,
    });

    if (data?.success) {
      dispatch({ type: "deleteEventSuccess", payload: { id: eventId } });
    } else {
      throw new Error("Unauthorized or failed deletion");
    }
  } catch (error) {
    dispatch({
      type: "deleteEventFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};


// ================== GET ALL EVENTS (Public) ==================
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllEventsRequest" });

    const { data } = await axios.get(`${server}/event/get-all-events`);

    dispatch({ type: "getAllEventsSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "getAllEventsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
