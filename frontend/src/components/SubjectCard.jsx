import { Eye, Download, Bot, Calendar, GraduationCap, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const API = "http://127.0.0.1:8000";

function SubjectCard({ paper }) {
  if (!paper) return null;

  const filePath = encodeURIComponent(paper.path);

  return (
    <div className="paper-card">

      <div className="paper-header">
        <h3>📘 {paper.subject}</h3>
      </div>

      <div className="paper-body">

        <div className="paper-info">
          <GraduationCap size={16} />
          <span>{paper.branch}</span>
        </div>

        <div className="paper-info">
          <Calendar size={16} />
          <span>{paper.year}</span>
        </div>

        <div className="paper-info">
          <FileText size={16} />
          <span>{paper.pattern}</span>
        </div>

        <div className="paper-file">
          📄 {paper.filename}
        </div>

      </div>

      <div className="paper-buttons">

        <Link
          to={`/pdf/${filePath}`}
          className="preview-btn"
        >
          <Eye size={16} />
          Preview
        </Link>

        <a
          href={`${API}/download?path=${filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn"
        >
          <Download size={16} />
          Download
        </a>

        <Link
          to={`/pdf/${filePath}`}
          className="ai-btn"
        >
          <Bot size={16} />
          Ask AI
        </Link>

      </div>

    </div>
  );
}

export default SubjectCard;