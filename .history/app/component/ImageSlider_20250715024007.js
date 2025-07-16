import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const ImageSlider = ({ images = [] }) => {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  // State for scale
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 400) {
        setScale(0.7);
      } else if (width < 600) {
        setScale(0.85);
      } else if (width < 900) {
        setScale(0.95);
      } else {
        setScale(1);
      }
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative mx-auto"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        transition: "transform 0.3s ease",
        maxWidth: "100%", // keep max width responsive
      }}
    >
      <div
        ref={sliderRef}
        className="keen-slider rounded-xl overflow-hidden"
        style={{ height: "250px" }}
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
