import React from "react";
import Image from "next/image";

const Avatar = () => {
  return (
    <Image
      src="/Avatar.gif"
      alt="Animated Avatar"
      width={200}
      height={200}
      priority
      className="rounded-full border-4 border-cyan-400 shadow-lg"
    />
  );
};

export default Avatar;
