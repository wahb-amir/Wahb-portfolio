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

  // ── SSR / pre-mount: match server markup exactly to avoid hydration mismatch ──
  if (!mounted) {
    if (serverPreview) {
      return (
        <div className="w-full h-full bg-gray-50 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={serverPreview}
            alt={`${title} preview`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-slate-800" />
    );
  }

  // ── No images ──
  if (!flatImages.length) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-slate-800" />
    );
  }

  // ── Client slider ──
  return (
    <div className="relative w-full h-full">
      <div
        ref={sliderRef}
        className="keen-slider w-full h-full overflow-hidden"
        style={{ height }}
      >
        {flatImages.map((src, i) => (
          <div
            key={i}
            className="keen-slider__slide relative w-full"
            style={{ height, minWidth: 0 }}
          >
            <Image
              src={src}
              alt={`${title} slide ${i + 1}`}
              fill
              // object-contain: always shows the full image, no zoom/crop
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 50vw"
              quality={80}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Prev / Next — only show if more than one image */}
      {flatImages.length > 1 && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10 transition-colors"
            aria-label="Previous slide"
            style={{ touchAction: "manipulation" }}
          >
            ◀
          </button>
          <button
            onClick={() => slider.current?.next()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10 transition-colors"
            aria-label="Next slide"
            style={{ touchAction: "manipulation" }}
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
}