"use client";

import dynamic from "next/dynamic";

const SpatialNavigation = dynamic(
  () => import("../navigation/SpatialNavigation"),
  { ssr: false },
);

export default function SpatialNavigationClient() {
  return <SpatialNavigation />;
}
