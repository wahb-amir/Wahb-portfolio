"use client";
import React from "react";
import Image from "next/image";

export default function Avatar() {
  return (
    <div className="relative group">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
        aria-hidden="true"
      />
      <figure className="relative mx-auto rounded-full p-1 bg-white dark:bg-slate-900 ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
        <Image
          src="/Avatar.svg"
          alt="Wahb"
          width={300}
          height={300}
          priority
          className="rounded-full object-cover w-full h-full"
        />
      </figure>
    </div>
  );
}