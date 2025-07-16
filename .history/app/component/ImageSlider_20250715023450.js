import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
const ImageSlider = ({ images = [] }) => {
  
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden h-30">
        {images.map((src, i) => {
          return (
            <div key={i} className="keen-slider__slide">
              <Image
                src={src[i]}
                alt={`Slide ${i + 1}`}
                className="w-full h-auto object-cover"
                fill={true}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                quality={100}
                loading="lazy"
              />
            </div>
          );
        })}
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
