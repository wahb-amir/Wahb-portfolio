"use client";

import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

type Props = {
  images?: string[];
  serverPreview?: string | null;
  title?: string;
  height?: number;
};

export default function ProjectImage({
  images = [],
  serverPreview,
  title = "project",
  height = 200,
}: Props) {
  const [mounted, setMounted] = useState(false);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const flatImages = images.flat?.() ?? images;

  /**
   * 🧠 IMPORTANT
   * Until mounted, render the SAME markup the server rendered
   * to avoid hydration mismatch
   */
  if (!mounted) {
    if (serverPreview) {
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <div className="w-full" style={{ height }}>
          <img
            src={serverPreview}
            alt={`${title} preview`}
            className="object-cover rounded-lg w-full h-full"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div
        className="w-full bg-gray-100 dark:bg-slate-800"
        style={{ height }}
      />
    );
  }

  /**
   * 🎯 Client-only interactive slider
   */
  if (!flatImages.length) {
    return (
      <div
        className="w-full bg-gray-100 dark:bg-slate-800"
        style={{ height }}
      />
    );
  }

  return (
    <div className="relative mx-auto max-w-full px-4 sm:px-6 md:px-8">
      <div
        ref={sliderRef}
        className="keen-slider rounded-xl overflow-hidden w-full"
        style={{ height }}
      >
        {flatImages.map((src, i) => (
          <div
            key={i}
            className="keen-slider__slide relative"
            style={{ height, overflow: "hidden" }}
          >
            <Image
              src={src}
              alt={`${title} slide ${i + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              quality={80}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        aria-label="Previous Slide"
        style={{ touchAction: "manipulation" }}
      >
        ◀
      </button>

      <button
        onClick={() => slider.current?.next()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        aria-label="Next Slide"
        style={{ touchAction: "manipulation" }}
      >
        ▶
      </button>
    </div>
  );
}
