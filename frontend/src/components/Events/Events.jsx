import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

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
