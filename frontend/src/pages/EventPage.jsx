import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import Footer from "../components/Layout/Footer";
import { getAllEvents } from "../redux/actions/event";

const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents()); 
  }, [dispatch]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {allEvents && allEvents.length > 0 ? (
            <EventCard active={true} data={allEvents[0]} />
          ) : (
            <p className="text-center text-gray-500 text-lg mt-10">No events available</p>
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;
