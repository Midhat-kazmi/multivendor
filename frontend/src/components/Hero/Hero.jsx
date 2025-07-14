import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const Hero = () => {
  return (
    <div className="w-full bg-white pt-4 pb-16"> {/* Changed pt-0 → pt-4 */}
      <div
        className={`${styles.section} grid grid-cols-1 md:grid-cols-2 gap-12 items-start`} // changed items-center → items-start
      >
        {/* Text Content */}
        <div className="pt-0">
          <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 leading-tight mb-4">
            Find Your Vibe
          </h1>
          <p className="text-lg text-gray-700 mb-3">
            Discover hand-picked{" "}
            <span className="text-pink-500 font-semibold">fashion</span>,
            electronics, and lifestyle products — delivered fast and with care.
          </p>
          <p className="text-md text-gray-600">
            Trusted by thousands. Loved by all. Explore what makes{" "}
            <span className="font-medium text-pink-500">Shopora</span> different.
          </p>

          {/* Trust Indicators */}
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <span className="text-pink-500 font-semibold">5000+</span> Happy Clients
            </p>
            <p className="flex items-center gap-2">
              Fast Delivery Across Pakistan
            </p>
            <p className="flex items-center gap-2">
              100% Genuine & Trusted Products
            </p>
          </div>

          {/* CTA Button */}
          <Link to="/products">
            <button className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-pink-600 transition">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="w-full h-[300px] md:h-[420px]">
          <img
            src="https://res.cloudinary.com/dgve6ewpr/image/upload/v1752436701/1b9be805bbb1ed47412cabd81ee649a0_y5lvrl.jpg"
            alt="Hero Visual"
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
