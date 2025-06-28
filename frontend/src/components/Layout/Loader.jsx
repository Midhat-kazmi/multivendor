import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/Animation - 1747476195462.json";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie animationData={animationData} loop={true} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default Loader;
