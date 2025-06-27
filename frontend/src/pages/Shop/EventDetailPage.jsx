import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

const EventDetailsPage = () => {
  const { id } = useParams();
  const { events } = useSelector((state) => state.events);

  const event = events.find((e) => e._id === id);

  if (!event) {
    return <div className="p-10 text-red-500">Event not found</div>;
  }

  return (
    <>
      <Header />
      <div className="p-10 min-h-screen bg-white">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        <img
          src={event.images[0]?.url}
          alt={event.name}
          className="w-1/2 h-auto object-contain mb-4 rounded-lg"
        />
        <p className="mb-2 text-lg">Price: <strong>US$ {event.discountPrice}</strong></p>
        <p className="mb-2 text-lg">Stock: {event.stock}</p>
        <p className="mb-2 text-lg">Sold: {event.sold_out}</p>
      </div>
      <Footer />
    </>
  );
};

export default EventDetailsPage;
