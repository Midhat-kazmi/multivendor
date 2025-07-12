import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import { getAllEvents } from "../../redux/actions/event";

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const firstEvent = allEvents?.[0];

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid">
            {firstEvent ? (
              <EventCard data={firstEvent} />
            ) : (
              <h4>No Events Available</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
