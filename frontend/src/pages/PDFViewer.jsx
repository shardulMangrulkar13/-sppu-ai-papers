import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function PDFViewer() {
  const navigate = useNavigate();
  const { filename } = useParams();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post(`${API}/ask`, {
        question,
      });

      setAnswer(res.data.answer);
    } catch (err) {
      console.log(err);
      setAnswer("Unable to get AI response.");
    }

    setLoading(false);
  };

  return (
    <div className="pdf-page">

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2>📄 Question Paper Preview</h2>

      <div className="pdf-viewer">

        <iframe
          title="PDF Viewer"
          src={`${API}/preview?path=${filename}`}
          width="100%"
          height="700"
        />

      </div>

      <div className="ai-box">

        <h2>🤖 Ask AI</h2>

        <textarea
          placeholder="Ask anything from this paper..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={askAI}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {answer && (
          <div className="answer-box">
            <h3>AI Response</h3>
            <p>{answer}</p>
          </div>
        )}

      </div>

    </div>
  );
}

export default PDFViewer;