import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, Send, Loader2, Copy, Trash2 } from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null);
  const answerRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    answerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [answer]);

  const suggestions = [
    "Important DBMS Questions",
    "Computer Network repeated topics",
    "Explain TOC Unit 3",
    "Java Viva Questions",
  ];

  async function askAI(text = question) {
  if (!text.trim()) return;

  try {
    setLoading(true);
    setAnswer("");
    setSources([]);

    const res = await axios.post(`${API}/ask`, {
      question: text,
    });

    if (typeof res.data === "string") {
      setAnswer(res.data);
      setSources([]);
    } else {
      setAnswer(
        res.data.answer ||
        res.data.response ||
        res.data.result ||
        JSON.stringify(res.data, null, 2)
      );

      setSources(res.data.sources || []);
    }

    setQuestion(text);
  } catch (err) {
    console.error(err);
    setAnswer("❌ Unable to connect to AI backend.");
    setSources([]);
  } finally {
    setLoading(false);
  }
}

  function copyAnswer() {
    navigator.clipboard.writeText(answer);
  }

  function clearAll() {
    setQuestion("");
    setAnswer("");
    textareaRef.current?.focus();
  }

  return (
    <div className="ai-card">
      <div className="ai-header">
        <Bot size={30} />

        <div>
          <h3>SPPU AI Study Assistant</h3>
          <span>🟢 Powered by RAG + AI</span>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        rows={5}
        placeholder="Ask anything about SPPU..."
        value={question}
        maxLength={500}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            askAI();
          }
        }}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        <span>Ctrl + Enter to Send</span>
        <span>{question.length}/500</span>
      </div>

      <button
        className="ai-btn"
        disabled={loading}
        onClick={() => askAI()}
      >
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

      <div className="ai-suggestions">
        <p>Popular Questions</p>

        {suggestions.map((item) => (
          <button
            key={item}
            className="suggestion-btn"
            onClick={() => askAI(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {answer && (
        <div
          className="ai-response"
          ref={answerRef}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <h4>🤖 AI Response</h4>

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <button
                className="suggestion-btn"
                onClick={copyAnswer}
              >
                <Copy size={16} />
              </button>

              <button
                className="suggestion-btn"
                onClick={clearAll}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div
            style={{
              lineHeight: 1.8,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {answer}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}