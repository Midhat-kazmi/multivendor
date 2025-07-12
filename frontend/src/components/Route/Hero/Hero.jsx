import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[85vh] w-full bg-no-repeat bg-cover bg-center`}
      style={{
        backgroundImage: `url("https://i.pinimg.com/736x/39/0a/39/390a396c996f97f4a30f49e34513bf9c.jpg")`,
      }}
    >
      {/* Optional overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className={`${styles.section} relative z-10 w-[90%] 800px:w-[60%] py-16`}>
        <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] text-white font-[600] capitalize drop-shadow-lg">
          Find Your Vibe
        </h1>

        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
