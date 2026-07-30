"use client";

/**
 * StarfieldBackgroundClient
 *
 * Thin "use client" wrapper so that the layout.tsx (a Server Component) can
 * safely defer StarfieldBackground to the client bundle with ssr:false.
 * Next.js App Router requires dynamic({ ssr: false }) to live inside a
 * Client Component boundary — this file is that boundary.
 */

import dynamic from "next/dynamic";

const StarfieldBackground = dynamic(
  () => import("./StarfieldBackground"),
  {
    ssr: false,
    loading: () => null, // no layout shift while the chunk loads
  }
);

export default function StarfieldBackgroundClient() {
  return <StarfieldBackground />;
}
