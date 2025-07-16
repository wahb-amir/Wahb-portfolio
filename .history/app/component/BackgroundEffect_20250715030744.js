import React from "react";

const BackgroundEffect = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-radial from-[#00dfd844] via-[#00000000] to-[#00000000] blur-2xl z-[-10]" />
      <div className="absolute top-[-20%] left-[-10%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] bg-[#00bfff] blur-3xl opacity-30 rounded-full z-[-10] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] bg-[#00dfd8] blur-3xl opacity-30 rounded-full z-[-10] animate-pulse" />
    </>
  );
};

export default BackgroundEffect;
