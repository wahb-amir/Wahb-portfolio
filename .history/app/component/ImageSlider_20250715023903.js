import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import React from "react";

const ImageSlider = ({ images = [] }) => {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 10, // add some gap between slides on desktop
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 1.5, spacing: 15 }, // small tablets & up, show 1.5 slides for cool effect
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 20 }, // desktop shows 3 slides
      },
    },
  });

  return (
    <div className="relative max-w-full mx-auto">
      <div
        ref={sliderRef}
        className="keen-slider rounded-xl overflow-hidden"
        style={{ height: "250px" }} // fixed height, you can adjust as needed
      >
        {images.map((src, i) => (
          <div key={i} className="keen-slider__slide">
            <Image
              src={src[i]}
              alt={`Slide ${i + 1}`}
              className="object-cover rounded-lg"
              fill={true}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              quality={100}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        aria-label="Previous Slide"
      >
        ◀
      </button>

      {/* Next Button */}
      <button
        onClick={() => slider.current?.next()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        aria-label="Next Slide"
      >
        ▶
      </button>
    </div>
  );
};

export default ImageSlider;
