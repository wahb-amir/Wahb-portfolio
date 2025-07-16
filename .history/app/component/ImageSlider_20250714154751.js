import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const ImageSlider = ({ images = [] }) => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden">
      {images.map((src, i) => (
        <div key={i} className="keen-slider__slide">
          <Image src={src} alt={`Slide ${i + 1}`} className="w-full h-auto" width={}/>
        </div>
      ))}
    </div>
  );
};
