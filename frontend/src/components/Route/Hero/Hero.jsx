import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div className="relative w-full min-h-[85vh] flex flex-col-reverse lg:flex-row items-center justify-between bg-gradient-to-r from-black via-black to-white overflow-hidden">
      {/* Left: Text Section */}
      <div
        className={`${styles.section} relative z-10 w-full lg:w-1/2 px-6 py-16 lg:py-0 flex flex-col justify-center`}
      >
        <h1 className="text-[42px] lg:text-[72px] leading-tight font-bold text-white drop-shadow-md">
          Find Your Vibe
        </h1>
        <p className="mt-4 text-white text-[18px] lg:text-[22px] font-[300] leading-[1.6] max-w-[600px] drop-shadow-md">
          Explore premium fashion, electronics & lifestyle essentials.
        </p>
        <p className="mt-2 text-white text-[20px] lg:text-[24px] font-[300] drop-shadow-sm">
          Curated collections. Seamless shopping. QuickCart delivers, always.
        </p>

        <Link to="/products" className="mt-6 inline-block">
          <div className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-3 rounded-md transition duration-300 shadow-md">
            Shop Now →
          </div>
        </Link>
      </div>

      {/* Right: Image */}
      <div className="w-full lg:w-1/2 h-[300px] lg:h-full relative">
        <img
          src="https://i.pinimg.com/736x/39/0a/39/390a396c996f97f4a30f49e34513bf9c.jpg"
          alt="Hero"
          className="w-full h-full object-cover object-center grayscale lg:grayscale-0"
          style={{ objectPosition: "right center" }}
        />
        {/* Optional overlay for blend effect */}
        <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent opacity-70" />
      </div>
    </div>
  );
};

export default Hero;
