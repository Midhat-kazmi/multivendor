import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className="relative min-h-[85vh] w-full bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url("https://i.pinimg.com/736x/39/0a/39/390a396c996f97f4a30f49e34513bf9c.jpg")`,
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className={`${styles.section} relative z-10 w-[90%] 800px:w-[60%] py-16`}>
        <h1 className="text-[45px] 800px:text-[200px] leading-[1.2] text-white font-[600] capitalize drop-shadow-lg">
          Find Your Vibe
        </h1>
        <p className="mt-4 text-white text-[20px] 800px:text-[30px] font-[400] leading-[1.6] max-w-[600px] drop-shadow-md">
          Discover hand-picked fashion, electronics, and lifestyle products — all delivered fast and with care. QuickCart brings you the best deals every day.
        </p>

        <p className="mt-2 text-white text-[24px] 800px:text-[30px] font-[300] drop-shadow-sm">
          Trusted by thousands. Loved by all. Explore what makes QuickCart different.
        </p>

        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-6`}>
            <span className="text-white font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
