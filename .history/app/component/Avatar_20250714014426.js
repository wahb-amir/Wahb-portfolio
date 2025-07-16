import React from "react";
import Image from "next/image";

const Avatar = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full">
      <Image
        src="/Avatar.svg"
        alt="Animated Avatar"
        width={200}
        height={200}
        priority
        className="rounded-full border-4 border-cyan-400 shadow-lg"
      />
    </div>
  );
};

export default Avatar;
