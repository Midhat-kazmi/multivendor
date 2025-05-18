const initialState = {
  loading: false,
  success: false,
  error: null,
  events: [],
};

export const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    // CREATE
    case "eventCreateRequest":
      return { ...state, loading: true };

    case "eventCreateSuccess":
      return { ...state, loading: false, success: true };

    case "eventCreateFail":
      return { ...state, loading: false, error: action.payload };

    case "eventCreateReset":
      return { ...state, success: false, error: null };

    // GET ALL EVENTS OF SELLER
    case "getAllEventsShopRequest":
      return { ...state, loading: true };

    case "getAllEventsShopSuccess":
      return { ...state, loading: false, events: action.payload };

    case "getAllEventsShopFail":
      return { ...state, loading: false, error: action.payload };

    // DELETE
    case "deleteEventRequest":
      return { ...state, loading: true };

    case "deleteEventSuccess":
      return {
        ...state,
        loading: false,
        events: state.events.filter((event) => event._id !== action.payload.id),
      };

    case "deleteEventFail":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
