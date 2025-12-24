"use client";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
interface ArrowProps {
  topId: string;
  bottomId: string;
  topBlock: "start" | "center" | "end" | "nearest";
  bottomBlock: "start" | "center" | "end" | "nearest";
}
const Arrow = ({ topId, bottomId, topBlock, bottomBlock }: ArrowProps) => {
  return (
    <>
      <div className="relative z-10 flex justify-center items-center gap-6 mt-6">
        <button
          onClick={() =>
            document
              .getElementById(topId)
              ?.scrollIntoView({ behavior: "smooth", block: topBlock })
          }
          aria-label="Scroll Up"
          className="hover:scale-110 transition-transform"
        >
          <ChevronUpIcon
            className={`w-8 h-8 dark:text-cyan-300 text-cyan-600`}
          />
        </button>
        <button
          onClick={() =>
            document
              .getElementById(bottomId)
              ?.scrollIntoView({ behavior: "smooth", block: bottomBlock })
          }
          aria-label="Scroll Down"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon
            className={`w-8 h-8 dark:text-cyan-300 text-cyan-600`}
          />
        </button>
      </div>
    </>
  );
};

export default Arrow;
