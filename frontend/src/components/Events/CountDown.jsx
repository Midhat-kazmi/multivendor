import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const deletedRef = useRef(false); // Prevent multiple delete calls

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();

      if (
        Object.keys(updatedTimeLeft).length === 0 &&
        !deletedRef.current
      ) {
        // If expired and not deleted yet
        axios
          .delete(`${server}/event/delete-shop-event/${data._id}`)
          .then(() => {
            deletedRef.current = true;
          })
          .catch((err) => {
            console.error("Failed to delete expired event:", err);
          });
        clearInterval(interval); // Stop interval
      }

      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  function calculateTimeLeft() {
    const difference = new Date(data.end_Date) - new Date();
    if (difference <= 0) return {};

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => (
    <span key={interval} className="text-[25px] text-[#475ad2]">
      {timeLeft[interval]} {interval}{" "}
    </span>
  ));

  return (
    <div>
      {timerComponents.length > 0 ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
