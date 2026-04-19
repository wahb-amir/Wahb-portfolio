import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";

type RepoSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  repoLinks: {
    name: string;
    url: string;
  }[];
  projectTitle: string;
};

const RepoSelectorModal = ({
  isOpen,
  onClose,
  repoLinks,
  projectTitle,
}: RepoSelectorModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const SkeletonModal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl dark:bg-slate-800">
        <div className="mb-2 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        <div className="mb-6 h-4 w-72 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />

        <div className="space-y-3">
          <div className="h-12 w-full animate-pulse rounded-md bg-cyan-200/70 dark:bg-slate-700" />
          <div className="h-12 w-full animate-pulse rounded-md bg-cyan-200/70 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl dark:bg-slate-800 scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-white"
          aria-label="Close selector"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h3 className="mb-2 pr-8 text-xl font-bold text-gray-900 dark:text-white">
          Select Repository
        </h3>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
          For <strong>{projectTitle}</strong>, choose interface:
        </p>

        <div className="space-y-3">
          {repoLinks.map((repo, index) => (
            <a
              key={repo.url || index}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group flex w-full items-center justify-between rounded-md bg-cyan-500 px-4 py-3 text-white transition-all hover:bg-cyan-600 hover:shadow-md dark:bg-cyan-700 dark:hover:bg-cyan-600"
            >
              <span className="text-sm font-semibold sm:text-base">
                {repo.name}
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-2 h-5 w-5 opacity-80 group-hover:opacity-100"
              >
                <path
                  fillRule="evenodd"
                  d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.391 5.25 5.25 0 0 1-1.449-8.476l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.382 12.744a.75.75 0 0 1-1.06 0l-2.47-2.47a.75.75 0 0 1 1.06-1.06l2.47 2.47a.75.75 0 0 1 0 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return SkeletonModal;
  }

  return createPortal(modalContent, document.body);
};

export default RepoSelectorModal;
