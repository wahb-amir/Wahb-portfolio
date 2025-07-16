import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { loadLinksPreset } from "tsparticles-preset-links";

const Particles = dynamic(
  () => import("react-tsparticles").then((mod) => mod.Particles),
  { ssr: false, loading: () => null }
);

export default function CustomParticles({
  colors = ["#00dfd8", "#00bfff", "#00aaff", "##FFA50", "#FF0000"],
  fullScreen = false,
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMounted(true);
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const particlesInit = async (engine) => {
    await loadLinksPreset(engine);
  };

  if (!mounted) return null;

  const options = {
    preset: "links",
    fullScreen: { enable: fullScreen },
    background: { color: "transparent" },
    fpsLimit: 30,
    detectRetina: false,
    particles: {
      number: { value: 25 },
      color: { value: colors },
      links: {
        enable: true,
        distance: 100,
        color: colors,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        outModes: { default: "bounce" },
      },
      size: { value: { min: 1.5, max: 2.5 } },
      shape: { type: "circle" },
      opacity: { value: 0.4 },
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
      },
    },
  };

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Particles id="tsparticles" init={particlesInit} options={options} />
    </div>
  );
}
