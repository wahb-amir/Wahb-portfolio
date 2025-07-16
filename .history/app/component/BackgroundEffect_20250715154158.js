import { useEffect, useState } from "react";

const BackgroundEffect = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(matchDark.matches);

    const handler = (e) => setIsDark(e.matches);
    matchDark.addEventListener("change", handler);
    return () => matchDark.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <div
        className={`absolute inset-0 bg-gradient-radial blur-2xl z-[-10] transition-colors duration-1000 ${
          isDark
            ? "from-[#00dfd844] via-[#00000000] to-[#00000000]"
            : "from-[#00bfff33] via-[#ffffff00] to-[#ffffff00]"
        }`}
      />
      <div
        className={`absolute top-[-20%] left-[-10%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] rounded-full blur-3xl opacity-30 animate-pulse z-[-10] transition-colors duration-1000 ${
          isDark ? "bg-[#00bfff]" : "bg-[#7f5af0]"
        }`}
        style={{ animationDuration: "6s" }}
      />
      <div
        className={`absolute bottom-[-15%] right-[-10%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] rounded-full blur-3xl opacity-30 animate-pulse z-[-10] transition-colors duration-1000 ${
          isDark ? "bg-[#00dfd8]" : "bg-[#00dfd8aa]"
        }`}
        style={{ animationDuration: "5s" }}
      />
    </>
  );
};

export default BackgroundEffect;
