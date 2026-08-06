'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type RepoLink = {
  name: string;
  url: string;
};

type ProjectActionButtonsProps = {
  title?: string;
  liveLink?: string | null;
  repoLinks?: RepoLink[];
  status?: 'offline' | 'working' | 'live';
};

export default function ProjectActionButtons({
  title,
  liveLink,
  repoLinks = [],
  status = 'live',
}: ProjectActionButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isWorking = status === 'working';
  const isOffline = status === 'offline';

  useEffect(() => {
    if (isModalOpen) {
      setIsClosing(false);
      setIsVisible(false);
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    setIsClosing(false);
  }, [isModalOpen]);

  const liveButtonClass = isOffline
    ? 'inline-flex items-center gap-2 rounded-lg bg-gray-400 px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-not-allowed opacity-70'
    : isWorking
      ? 'inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-700'
      : 'inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-cyan-700';

  const handleLiveClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isWorking) {
      event.preventDefault();
      setIsModalOpen(true);
      return;
    }

    if (isOffline) {
      event.preventDefault();
    }
  };

  const requestClose = () => {
    if (!isModalOpen) return;
    setIsClosing(true);
    setIsVisible(false);
    window.setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 180);
  };
  const requestContinue = () => {
    window.open(liveLink || '', '_blank', 'noopener,noreferrer');
    requestClose();
  }

  const shouldShowModal = isModalOpen || isClosing;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {liveLink && (
          <div className="flex flex-col items-start">
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLiveClick}
              className={liveButtonClass}
              aria-label={`Open live demo of ${title}`}
              aria-disabled={isOffline || isWorking}
            >
              Live Demo
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
            </a>

            {isWorking && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                This project is still under development and may contain bugs.
              </p>
            )}

            {isOffline && (
              <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                The project is currently offline.
              </p>
            )}
          </div>
        )}

        {repoLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {repoLinks.map((repo) => (
              <a
                key={repo.url}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-600/70 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-cyan-600 dark:hover:bg-slate-700"
              >
                <CodeBracketIcon className="h-3.5 w-3.5" />
                <span>{repo.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {shouldShowModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm transition-all duration-200 ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}`}
          onClick={requestClose}
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-2xl shadow-amber-900/10 transition-all duration-200 dark:border-amber-700/50 dark:bg-slate-900/95 ${isVisible && !isClosing ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Still in progress
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    This project is still being improved.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={requestClose}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close warning"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              This preview is still under development, so you may encounter bugs,
              incomplete features, or other issues while exploring it.
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={requestContinue}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Continue anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
