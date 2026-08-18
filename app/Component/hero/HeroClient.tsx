"use client";

import dynamic from "next/dynamic";

// SSR enabled — content must be in server HTML for Google indexing.
// These components only use window/document inside useEffect / event handlers,
// so they are safe to server-render.
export { default as HeroCTAs } from "./HeroCTAs";
export { default as HeroProof } from "./HeroProof";
export { default as HeroScrollHint } from "./HeroScrollHint";

// GitHub activity: deferred past LCP via requestIdleCallback — keep ssr:false.
export const GitHubActivity = dynamic(() => import("../github/index"), {
  ssr: false,
  loading: () => null,
});
