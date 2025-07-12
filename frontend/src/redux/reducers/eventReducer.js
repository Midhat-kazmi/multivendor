// Fix reducer: use consistent action names

import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  events: [],
  event: null,
  error: null,
  success: false,
 allEvents: [],
};

export const eventReducer = createReducer(initialState, (builder) => {
  builder
    // Create Event
    .addCase("eventCreateRequest", (state) => {
      state.isLoading = true;
      state.success = false;
    })
    .addCase("eventCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.success = true;
    })
    .addCase("eventCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get all events of shop
    .addCase("getAllEventsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllEventsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
    })
    .addCase("getAllEventsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Delete event
    .addCase("deleteEventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteEventSuccess", (state, action) => {
      state.isLoading = false;
      // Remove deleted event from events array
      state.events = state.events.filter((event) => event._id !== action.payload.id);
    })
    .addCase("deleteEventFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Get all events (public)
    .addCase("getAlleventsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAlleventsSuccess", (state, action) => {
      state.isLoading = false;
      state.allEvents = action.payload;
    })
    .addCase("getAlleventsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Clear errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
