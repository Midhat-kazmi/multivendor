import React from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div className={`${styles.section} py-12`}>
      {!isLoading && (
        <>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">
              🌟 Popular Events
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Don’t miss these exclusive deals
            </p>
          </div>

          <div className="w-full grid grid-cols-1 gap-12">
            {allEvents && allEvents.length > 0 ? (
              allEvents.map((event, index) => (
                <EventCard key={event._id || index} data={event} active={true} />
              ))
            ) : (
              <h4 className="text-center text-gray-600">No Events Available</h4>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Events;
