"use client";

import ProjectActionButtons from "./ProjectActionButtons";

type Props = {
  title?: string;
  liveLink?: string | null;
  repoLinks?: {
    name: string;
    url: string;
  }[];
  status?: "offline" | "working" | "live";
};

export default function ActionsHydrate({
  title,
  liveLink,
  repoLinks = [],
  status = "live",
}: Props) {
  return (
    <ProjectActionButtons
      title={title}
      liveLink={liveLink}
      repoLinks={repoLinks}
      status={status}
    />
  );
}
