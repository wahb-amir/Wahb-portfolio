import React from "react";
import Image from "next/image";

const Avatar = () => {
  return (
    <div className="Avatar rounded-full min-w-full m-auto">
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
