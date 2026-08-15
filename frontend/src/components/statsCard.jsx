import { FileText, GraduationCap, BookOpen, Bot } from "lucide-react";

function StatsCard({ title, value }) {
  let Icon = FileText;
  let color = "#2563eb";

  if (title === "Branches") {
    Icon = GraduationCap;
    color = "#16a34a";
  }

  if (title === "Subjects") {
    Icon = BookOpen;
    color = "#f97316";
  }

  if (title === "AI Support") {
    Icon = Bot;
    color = "#9333ea";
  }

  return (
    <div className="stat-card">
      <div
        className="stat-icon"
        style={{
          background: `${color}15`,
          color,
        }}
      >
        <Icon size={28} />
      </div>

      <div className="stat-content">
        <p>{title}</p>

        <h2
          style={{
            color,
          }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}

export default StatsCard;
