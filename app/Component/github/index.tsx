import ActivityClient from "./ActivityClient";
import "./github-activity.css";

export default function GitHubActivity() {
  return (
    <div className="gh-card">
      <ActivityClient />
    </div>
  );
}

export function GitHubActivityShell() {
  return (
    <div className="gh-card" style={{ minHeight: 160 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div className="gh-status-dot" />
        <span className="gh-label">GitHub Contributions</span>
      </div>
      <div className="gh-calendar-area" />
    </div>
  );
}
