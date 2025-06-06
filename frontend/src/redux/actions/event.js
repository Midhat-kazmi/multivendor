import axios from "axios";
import { server } from "../../server";

export const createEvent = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });

    // Debug: Log FormData contents before sending
    console.log("FormData contents before sending:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const config = {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true
    };

    console.log("Sending request to:", `${server}/event/create-event`);
    console.log("Request config:", config);

    const { data } = await axios.post(
      `${server}/event/create-event`,
      formData,
      config
    );

    console.log("Server response:", data);

    dispatch({ type: "eventCreateSuccess", payload: data.event });
  } catch (error) {
    console.error("Event creation error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || "Failed to create event",
    });
  }
};




// Get all events of a specific seller
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllEventsShopRequest" });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);

    dispatch({ type: "getAllEventsShopSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "getAllEventsShopFail",
      payload: error.response?.data?.message || "Failed to load events",
    });
  }
};

// Delete an event
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteEventRequest" });

    const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, {
      withCredentials: true,
    });

   dispatch({ type: "deleteEventSuccess", payload: { id } });
  } catch (error) {
    dispatch({
      type: "deleteEventFail",
      payload: error.response?.data?.message || "Failed to delete event",
    });
  }
};

export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response.data.message,
    });
  }
};