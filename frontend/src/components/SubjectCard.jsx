import {
  Eye,
  Download,
  Bot,
  Calendar,
  GraduationCap,
  FileText,
} from "lucide-react";

import { Link } from "react-router-dom";

const API = "https://sppu-ai-backend-304115043483.asia-south1.run.app";

function SubjectCard({ paper }) {
  if (!paper) return null;

  return (
    <div className="paper-card">
      <div className="paper-header">
        <span className="paper-pattern">{paper.pattern}</span>

        <span className="paper-year">{paper.exam_year}</span>
      </div>

      <h3 className="paper-title">{paper.subject}</h3>

      <div className="paper-info">
        <div className="paper-row">
          <GraduationCap size={17} />
          <span>{paper.branch}</span>
        </div>

        <div className="paper-row">
          <Calendar size={17} />
          <span>{paper.academic_year}</span>
        </div>

        <div className="paper-row">
          <FileText size={17} />
          <span>{paper.filename}</span>
        </div>
      </div>

      <div className="paper-buttons">
        <Link className="preview-btn" to="/pdf" state={{ path: paper.path }}>
          <Eye size={18} />
          Preview
        </Link>

        <a
          className="download-btn"
          href={`${API}/download?path=${encodeURIComponent(paper.path)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={18} />
          Download
        </a>
      </div>

      <Link className="paper-ai-btn" to="/pdf" state={{ path: paper.path }}>
        <Bot size={18} />
        Ask AI About This Paper
      </Link>
    </div>
  );
}

export default SubjectCard;
