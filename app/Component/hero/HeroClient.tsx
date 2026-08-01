"use client";

import dynamic from "next/dynamic";

export const HeroCTAs = dynamic(() => import("./HeroCTAs"), {
  ssr: false,
  loading: () => (
    <div
      className="h-fade-up h-d7 mt-8 flex flex-wrap justify-center gap-3 min-h-[44px]"
      aria-hidden
    />
  ),
});

export const HeroProof = dynamic(() => import("./HeroProof"), {
  ssr: false,
  loading: () => (
    <div className="h-fade-up h-d7 mt-4 min-h-[24px]" aria-hidden />
  ),
});

export const HeroScrollHint = dynamic(() => import("./HeroScrollHint"), {
  ssr: false,
  loading: () => null,
});

export const GitHubActivity = dynamic(() => import("../github/index"), {
  ssr: false,
  loading: () => null,
});
