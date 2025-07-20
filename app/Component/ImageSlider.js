import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import React from "react";

const ImageSlider = ({ images = [] }) => {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  const flatImages = images.flat();

  return (
    <div className="relative mx-auto max-w-full px-4 sm:px-6 md:px-8">
      <div
        ref={sliderRef}
        className="keen-slider rounded-xl overflow-hidden w-full"
        style={{ height: "200px", maxWidth: "100%", margin: "0 auto" }}
      >
        {flatImages.map((src, i) => (
          <div
            key={i}
            className="keen-slider__slide relative"
            style={{ height: "200px", overflow: "hidden" }}
          >
            <Image
              src={src}
              alt={`Slide ${i + 1}`}
              className="object-cover rounded-lg"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              quality={100}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => slider.current?.prev()}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        aria-label="Previous Slide"
        style={{ touchAction: "manipulation" }}
      >
        ◀
      </button>

      <button
        onClick={() => slider.current?.next()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        aria-label="Next Slide"
        style={{ touchAction: "manipulation" }}
      >
        ▶
      </button>
    </div>
  );
};

export default ImageSlider;
