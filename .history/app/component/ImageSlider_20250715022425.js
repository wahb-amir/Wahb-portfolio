import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useState } from "react";

const ImageSlider = ({ images = [] }) => {
  console.log("Images in slider:", images);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden">
        {images.map((src, i) => (
          <div key={i} className="keen-slider__slide">
            <Image
              src={src}
              alt={`Slide ${i + 1}`}
              className="w-full h-auto object-cover"
              width={200}
              height={150}
              quality={100}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => slider.current?.prev()}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        ◀
      </button>

      <button
        onClick={() => slider.current?.next()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        ▶
      </button>
    </div>
  );
};

export default ImageSlider;
