import axios from "axios";
import { server } from "../../server";

// Create Event 
export const createEvent = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true, //  cookie sent
    };
    const { data } = await axios.post(
      `${server}/event/create-event`,
      formData,
      config
    );
    dispatch({ type: "eventCreateSuccess", payload: data.event });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get Events by Shop ✅
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllEventsShopRequest" });
    const { data } = await axios.get(
      `${server}/event/get-all-events/${id}`,
      { withCredentials: true } // ✅ added
    );
    dispatch({ type: "getAllEventsShopSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "getAllEventsShopFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Event ✅
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteEventRequest" });
    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      { withCredentials: true }
    );
    dispatch({ type: "deleteEventSuccess", payload: { id } });
  } catch (error) {
    dispatch({
      type: "deleteEventFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Events (Public)
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({ type: "getAlleventsRequest" });
    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({ type: "getAlleventsSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
