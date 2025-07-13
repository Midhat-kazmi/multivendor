import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const Hero = () => {
  return (
    <div className="w-full bg-white py-16">
      <div className={`${styles.section} grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
        {/* Text Content */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Find Your Vibe
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Discover hand-picked fashion, electronics, and lifestyle products delivered fast and with care.
          </p>
          <p className="text-md text-gray-600">
            Trusted by thousands. Loved by all. Explore what makes QuickCart different.
          </p>
          <Link to="/products">
            <button className="mt-6 bg-black text-white px-6 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Placeholder / Future Image Block */}
        <div className="w-full h-[300px] md:h-[400px] bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center rounded-xl">
          <span className="text-gray-400 text-lg">[ Image or Illustration Here ]</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
