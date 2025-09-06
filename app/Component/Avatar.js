"use client";
import React from "react";
import Image from "next/image";

export default function Avatar() {
  return (
    <figure aria-hidden="true" className="mx-auto">
      <Image
        src="/Avatar.svg"
        alt=""
        width={300}
        height={300}
        priority
        className="rounded-full border-4 border-cyan-400 shadow-lg"
      />
    </figure>
  );
}
