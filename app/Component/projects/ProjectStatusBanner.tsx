type ProjectStatus = "offline" | "working" | "live";

interface ProjectStatusBannerProps {
  status: ProjectStatus;
  onStatusChange?: (status: ProjectStatus) => void;
}

const statusConfig = {
  offline: {
    icon: "⚠️",
    title: "Project Offline",
    message: "This project isn't live right now.",
    container:
      "border-yellow-400/70 bg-yellow-50/90 text-yellow-800 shadow-yellow-100/70 dark:border-yellow-500/50 dark:bg-yellow-950/30 dark:text-yellow-200 dark:shadow-none",
    button:
      "bg-yellow-200 text-yellow-900 hover:bg-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-100 dark:hover:bg-yellow-800/60",
  },
  working: {
    icon: "🚧",
    title: "Currently Working",
    message: "We're improving this project and it will be online soon.",
    container:
      "border-cyan-400/70 bg-cyan-50/90 text-cyan-800 shadow-cyan-100/70 dark:border-cyan-500/50 dark:bg-cyan-950/30 dark:text-cyan-200 dark:shadow-none",
    button:
      "bg-cyan-200 text-cyan-900 hover:bg-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-100 dark:hover:bg-cyan-800/60",
  },
  live: {
    icon: "✅",
    title: "Project Live",
    message: "The project is now available!",
    container:
      "border-emerald-400/70 bg-emerald-50/90 text-emerald-800 shadow-emerald-100/70 dark:border-emerald-500/50 dark:bg-emerald-950/30 dark:text-emerald-200 dark:shadow-none",
    button:
      "bg-emerald-200 text-emerald-900 hover:bg-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-100 dark:hover:bg-emerald-800/60",
  },
};

export default function ProjectStatusBanner({
  status,
  onStatusChange,
}: ProjectStatusBannerProps) {
  const current = statusConfig[status];

  return (
    <div
      className={`rounded-xl border-l-4 p-4 shadow-sm backdrop-blur-sm ${current.container}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{current.icon}</span>

        <div>
          <h3 className="font-semibold">{current.title}</h3>
          <p className="text-sm">{current.message}</p>
        </div>
      </div>

      {onStatusChange && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange("offline")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${current.button}`}
          >
            Offline
          </button>

          <button
            onClick={() => onStatusChange("working")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${current.button}`}
          >
            Working
          </button>

          <button
            onClick={() => onStatusChange("live")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${current.button}`}
          >
            Live
          </button>
        </div>
      )}
    </div>
  );
}