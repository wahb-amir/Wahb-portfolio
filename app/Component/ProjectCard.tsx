"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import RepoSelectorModal from "./RepoSelectorModal";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
type Props = {
  title?: string;
  liveLink?: string | null;
  repoLinks?: string[];
};

export default function ActionsHydrate({
  title,
  liveLink,
  repoLinks = [],
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render identical static markup as server while not mounted
  if (!mounted) {
    return (
      <>
        <div className="flex gap-3">
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800"
            >
              Live Demo <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          )}

          {repoLinks.length === 1 && (
            <a
              href={repoLinks[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium"
            >
              Code <CodeBracketIcon className="w-4 h-4" />
            </a>
          )}

          {repoLinks.length > 1 && (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium">
              <span>Code:</span>
              <ul className="ml-2 list-inside list-disc">
                {repoLinks.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                    >
                      {r}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative z-10 flex justify-center items-center gap-6 mt-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
                .getElementById("project-section")
                ?.scrollIntoView({ behavior: "smooth", block: "center" })
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
  }

  return (
    <>
      <div className="flex gap-3">
        {liveLink && (
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            aria-label={`Open live demo of ${title}`}
          >
            Live Demo <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        )}

        {repoLinks.length === 1 && (
          <a
            href={repoLinks[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium"
            aria-label={`Open GitHub repo of ${title}`}
          >
            Code <CodeBracketIcon className="w-4 h-4" />
          </a>
        )}

        {repoLinks.length > 1 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium"
          >
            Select repo <CodeBracketIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {repoLinks.length > 1 && (
        <RepoSelectorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          repoLinks={repoLinks}
          //   @ts-ignore
          projectTitle={title}
        />
      )}
    </>
  );
}
