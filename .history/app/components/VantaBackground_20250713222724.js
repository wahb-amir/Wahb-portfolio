"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min"; // Try "fog", "waves", etc

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect && typeof window !== "undefined") {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          color: 0x00f0ff,
          backgroundColor: 0x0d0d0d,
          points: 12.0,
          maxDistance: 20.0,
          spacing: 15.0,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};

export default VantaBackground;
