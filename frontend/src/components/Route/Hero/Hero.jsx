import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
  <div className="w-full bg-white pt-0 pb-16">
      <div
        className={`${styles.section} grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}
      >
        {/* Text Content */}
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 leading-tight mb-6">
            Find Your Vibe
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Discover hand-picked{" "}
            <span className="text-pink-500 font-semibold">fashion</span>,
            electronics, and lifestyle products — delivered fast and with care.
          </p>
          <p className="text-md text-gray-600">
            Trusted by thousands. Loved by all. Explore what makes{" "}
            <span className="font-medium text-pink-500">Shopora</span> different.
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 space-y-3 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <span className="text-pink-500 text-lg"></span>
              <span>
                <span className="text-pink-500 font-semibold">5000+</span> Happy Clients
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-pink-500 text-lg"></span>
              Fast Delivery Across Pakistan
            </p>
            <p className="flex items-center gap-2">
              <span className="text-pink-500 text-lg"></span>
              100% Genuine & Trusted Products
            </p>
          </div>

          {/* CTA Button at Bottom */}
          <Link to="/products">
            <button className="mt-8 bg-pink-500 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-pink-600 transition">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Image Block */}
        <div className="w-full h-[300px] md:h-[420px]">
          <img
            src="https://res.cloudinary.com/dgve6ewpr/image/upload/v1752435898/c4b12e0f753927baf980b46482645cb4_x7sceo.jpg"
            alt="Hero Visual"
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
