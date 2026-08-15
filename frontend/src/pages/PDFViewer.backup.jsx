import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Download, Bot, Send, Loader2 } from "lucide-react";

const API = "https://sppu-ai-backend-304115043483.asia-south1.run.app";

function PDFViewer() {
  const navigate = useNavigate();
  const location = useLocation();

  const filePath = location.state?.path || "";

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      const res = await axios.post(`${API}/ask`, {
        question,
      });

      if (typeof res.data === "string") {
        setAnswer(res.data);
      } else {
        setAnswer(
          res.data.answer ||
            res.data.response ||
            res.data.result ||
            "No response available.",
        );
      }
    } catch (err) {
      console.log(err);
      setAnswer("Unable to connect to AI.");
    } finally {
      setLoading(false);
    }
  }

  if (!filePath) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
        }}
      >
        <h2>No PDF Selected</h2>

        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="pdf-page">
      <div className="pdf-toolbar">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Back
        </button>

        <a
          className="download-btn"
          href={`${API}/download?path=${encodeURIComponent(filePath)}`}
          target="_blank"
          rel="noreferrer"
        >
          <Download size={18} />
          Download
        </a>
      </div>

      <div className="pdf-layout">
        <div className="pdf-viewer">
          <iframe
            title="PDF Viewer"
            src={`${API}/preview?path=${encodeURIComponent(filePath)}`}
            className="pdf-frame"
          />
        </div>

        <div className="pdf-ai">
          <div className="pdf-ai-header">
            <Bot size={26} />

            <div>
              <h3>Ask AI</h3>

              <p>Ask anything about this paper</p>
            </div>
          </div>

          <textarea
            rows={5}
            value={question}
            placeholder="Example: Explain Question 3"
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button className="ai-btn" onClick={askAI} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send size={18} />
                Ask AI
              </>
            )}
          </button>

          {answer && (
            <div className="pdf-answer">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {answer}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
